import cv2
import mediapipe as mp
import pyautogui
import numpy as np
import tensorflow as tf
import time
import sys
import os
from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import threading

# Flask app setup
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")


class EyeTrackingServer:
    def __init__(self):
        # Initialize camera
        self.cam = None

        # Initialize face mesh with higher confidence threshold
        self.face_mesh = mp.solutions.face_mesh.FaceMesh(
            refine_landmarks=True,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.7
        )

        # Get screen dimensions
        self.screen_w, self.screen_h = pyautogui.size()

        # Smoothing parameters
        self.smoothing_factor = 0.6  # Increased for more stability
        self.prev_x, self.prev_y = 0, 0

        # Enhanced blink detection parameters
        self.blink_counter = 0
        self.blink_threshold = 0.0035
        self.blink_detected = False
        self.last_blink_time = time.time()
        self.blink_cooldown = 0.5
        self.double_click_timeout = 0.7  # Time window for double click detection

        # Eye landmarks for tracking
        self.eye_landmarks = [474, 475, 476, 477]  # Iris landmarks

        # Blink confidence metrics
        self.ear_history = []
        self.history_length = 15  # Increased for better stability
        self.consecutive_blinks_needed = 2  # Number of consecutive frames with blink detection
        self.consecutive_blink_counter = 0

        # Selection feedback
        self.selection_confidence = 0

        # Threading
        self.tracking_thread = None
        self.is_running = False
        self.is_tracking_enabled = False

        # Disable pyautogui pause and fail-safe for smoother operation
        pyautogui.PAUSE = 0
        pyautogui.FAILSAFE = False

        # Calibration variables
        self.is_calibrating = False
        self.calibration_points = []
        self.calibration_count = 0
        self.calibration_max = 5
        self.calibration_offset_x = 0
        self.calibration_offset_y = 0
        self.calibration_scale_x = 1.0
        self.calibration_scale_y = 1.0

        # Dwell click variables (alternative to blink)
        self.dwell_enabled = False
        self.dwell_time = 1.5  # seconds
        self.dwell_start_time = 0
        self.dwell_position = (0, 0)
        self.dwell_radius = 30  # pixel radius for dwell detection

        # Current mode
        self.mode = "blink"  # "blink" or "dwell"

        # Emotion detection
        self.emotion_detection_enabled = False
        self.emotion_model = tf.keras.models.load_model("FER_model.h5")  # Load emotion detection model
        self.emotion_labels = ["Angry", "Disgust", "Fear", "Happy", "Neutral", "Sad", "Surprise"]

        # Initialize Haar Cascade for face detection
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

    def start_tracking(self):
        if not self.is_tracking_enabled:
            self.is_tracking_enabled = True
            self.cam = cv2.VideoCapture(0)
            self.is_running = True
            self.tracking_thread = threading.Thread(target=self._track_eyes)
            self.tracking_thread.daemon = True
            self.tracking_thread.start()
            socketio.emit('tracking_status', {'enabled': True})

    def stop_tracking(self):
        if self.is_tracking_enabled:
            self.is_tracking_enabled = False
            self.is_running = False
            if self.tracking_thread:
                self.tracking_thread.join(timeout=1.0)
            if self.cam:
                self.cam.release()
                self.cam = None
            socketio.emit('tracking_status', {'enabled': False})

    def toggle_mode(self):
        """Toggle between blink mode and dwell mode"""
        if self.mode == "blink":
            self.mode = "dwell"
        else:
            self.mode = "blink"
        socketio.emit('mode_changed', {'mode': self.mode})

    def start_calibration(self):
        """Start the calibration process"""
        self.is_calibrating = True
        self.calibration_points = []
        self.calibration_count = 0
        socketio.emit('calibration_point', {
            'x': int(self.screen_w * 0.1),
            'y': int(self.screen_h * 0.1),
            'count': 1,
            'total': self.calibration_max
        })

    def add_calibration_point(self, screen_point, eye_point):
        """Add a calibration point"""
        self.calibration_points.append((screen_point, eye_point))
        self.calibration_count += 1

        # Request next calibration point
        if self.calibration_count < self.calibration_max:
            # Generate points at different screen locations
            x = int(self.screen_w * (0.1 + (self.calibration_count % 3) * 0.4))
            y = int(self.screen_h * (0.1 + (self.calibration_count // 3) * 0.4))
            socketio.emit('calibration_point', {
                'x': x,
                'y': y,
                'count': self.calibration_count + 1,
                'total': self.calibration_max
            })
        else:
            # Finish calibration and calculate offsets
            self._calculate_calibration()
            self.is_calibrating = False
            socketio.emit('calibration_complete', {
                'offset_x': self.calibration_offset_x,
                'offset_y': self.calibration_offset_y,
                'scale_x': self.calibration_scale_x,
                'scale_y': self.calibration_scale_y
            })

    def _calculate_calibration(self):
        """Calculate calibration parameters from collected points"""
        if len(self.calibration_points) < 2:
            return

        screen_points = np.array([p[0] for p in self.calibration_points])
        eye_points = np.array([p[1] for p in self.calibration_points])

        # Calculate average offset
        offsets = screen_points - eye_points
        self.calibration_offset_x = np.mean(offsets[:, 0])
        self.calibration_offset_y = np.mean(offsets[:, 1])

        # Calculate scale factors (if enough points)
        if len(self.calibration_points) >= 4:
            eye_range_x = np.max(eye_points[:, 0]) - np.min(eye_points[:, 0])
            eye_range_y = np.max(eye_points[:, 1]) - np.min(eye_points[:, 1])
            screen_range_x = np.max(screen_points[:, 0]) - np.min(screen_points[:, 0])
            screen_range_y = np.max(screen_points[:, 1]) - np.min(screen_points[:, 1])

            if eye_range_x > 0 and eye_range_y > 0:
                self.calibration_scale_x = screen_range_x / eye_range_x
                self.calibration_scale_y = screen_range_y / eye_range_y

    def _process_blink(self, left_eye_upper, left_eye_lower, frame, frame_w, frame_h):
        """Process eye blink detection with improved accuracy"""
        # Calculate eye aspect ratio (EAR)
        eye_aspect_ratio = abs(left_eye_upper.y - left_eye_lower.y)

        # Add to history for running average
        self.ear_history.append(eye_aspect_ratio)
        if len(self.ear_history) > self.history_length:
            self.ear_history.pop(0)

        # Use average EAR for more stable detection
        avg_ear = sum(self.ear_history) / len(self.ear_history)

        # Visualize eye landmarks for debugging
        for landmark in [left_eye_upper, left_eye_lower]:
            x = int(landmark.x * frame_w)
            y = int(landmark.y * frame_h)
            cv2.circle(frame, (x, y), 3, (0, 255, 255), -1)

        # Add visual indicators for blink threshold
        cv2.putText(frame, f"EAR: {eye_aspect_ratio:.6f}", (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
        cv2.putText(frame, f"Threshold: {self.blink_threshold:.6f}", (10, 60),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)

        # Blink detection with enhanced accuracy
        current_time = time.time()
        click_performed = False

        # Check if eye is closed (blink detected)
        if eye_aspect_ratio < self.blink_threshold:
            self.consecutive_blink_counter += 1

            # Only register as blink if we have consecutive frames with closed eyes
            if self.consecutive_blink_counter >= self.consecutive_blinks_needed:
                if not self.blink_detected and current_time - self.last_blink_time > self.blink_cooldown:
                    self.blink_counter += 1

                    # Check for double-click
                    if current_time - self.last_blink_time < self.double_click_timeout:
                        pyautogui.doubleClick()
                        cv2.putText(frame, "DOUBLE CLICK!", (frame_w - 230, 30),
                                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 3)
                        socketio.emit('click_event', {'type': 'double'})
                        click_performed = True
                    else:
                        pyautogui.click()
                        cv2.putText(frame, "CLICK!", (frame_w - 120, 30),
                                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 3)
                        socketio.emit('click_event', {'type': 'single'})
                        click_performed = True

                    self.last_blink_time = current_time
                    self.blink_detected = True
                    self.selection_confidence = 1.0
        else:
            self.consecutive_blink_counter = 0
            if eye_aspect_ratio > self.blink_threshold * 1.5:
                self.blink_detected = False

            # Decay selection confidence
            self.selection_confidence *= 0.8

        return click_performed

    def _process_dwell(self, screen_x, screen_y, frame, frame_w, frame_h):
        """Process dwell-based click detection"""
        current_time = time.time()
        click_performed = False

        # Check if cursor position is stable (within dwell radius)
        if (self.dwell_start_time > 0 and
                abs(screen_x - self.dwell_position[0]) < self.dwell_radius and
                abs(screen_y - self.dwell_position[1]) < self.dwell_radius):

            # Calculate how much time has passed
            dwell_elapsed = current_time - self.dwell_start_time

            # Visual feedback on progress
            progress = min(1.0, dwell_elapsed / self.dwell_time)
            radius = int(30 * progress)
            cv2.circle(frame, (int(screen_x * frame_w / self.screen_w),
                               int(screen_y * frame_h / self.screen_h)),
                       radius, (0, 255 * progress, 255 * (1 - progress)), 2)

            # Check if dwell time reached
            if dwell_elapsed >= self.dwell_time:
                pyautogui.click()
                cv2.putText(frame, "DWELL CLICK!", (frame_w - 200, 30),
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 3)
                socketio.emit('click_event', {'type': 'dwell'})
                self.dwell_start_time = 0  # Reset timer
                click_performed = True
        else:
            # Reset dwell timer and position
            self.dwell_start_time = current_time
            self.dwell_position = (screen_x, screen_y)

        return click_performed

    def _apply_calibration(self, screen_x, screen_y):
        """Apply calibration offsets and scaling to eye tracking coordinates"""
        calibrated_x = screen_x * self.calibration_scale_x + self.calibration_offset_x
        calibrated_y = screen_y * self.calibration_scale_y + self.calibration_offset_y

        # Constrain to screen boundaries
        calibrated_x = max(0, min(self.screen_w, calibrated_x))
        calibrated_y = max(0, min(self.screen_h, calibrated_y))

        return calibrated_x, calibrated_y

    def _detect_emotion(self, frame):
        """Detect emotion from the face region"""
        # Convert frame to grayscale
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Detect faces in the frame
        faces = self.face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)

        for (x, y, w, h) in faces:
            # Extract the face region
            face = gray[y:y + h, x:x + w]

            # Resize to 48x48 (model's input size)
            face_resized = cv2.resize(face, (48, 48))

            # Normalize (scale pixel values between 0 and 1)
            face_normalized = face_resized / 255.0

            # Reshape to match model's input shape: (1, 48, 48, 1)
            face_reshaped = np.expand_dims(face_normalized, axis=0)  # Add batch dimension
            face_reshaped = np.expand_dims(face_reshaped, axis=-1)  # Add channel dimension

            # Make prediction
            prediction = self.emotion_model.predict(face_reshaped)
            emotion_index = np.argmax(prediction)  # Get highest probability index

            # Ensure index is within range of emotion_labels
            if emotion_index < len(self.emotion_labels):
                emotion = self.emotion_labels[emotion_index]
            else:
                emotion = "Unknown"

            return emotion

        return None

    def _track_eyes(self):
        """Main eye tracking loop"""
        while self.is_running and self.is_tracking_enabled:
            ret, frame = self.cam.read()
            if not ret:
                continue

            # Flip horizontally for mirror effect
            frame = cv2.flip(frame, 1)

            # Convert to RGB for MediaPipe
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            # Process the frame
            output = self.face_mesh.process(rgb_frame)
            landmark_points = output.multi_face_landmarks
            frame_h, frame_w, _ = frame.shape

            tracking_data = {
                'tracking': False,
                'cursor_x': 0,
                'cursor_y': 0,
                'click': False,
                'mode': self.mode,
                'selection_confidence': self.selection_confidence,
                'emotion': None  # Emotion data
            }

            if landmark_points:
                landmarks = landmark_points[0].landmark
                tracking_data['tracking'] = True

                # Iris tracking for cursor movement
                iris_x, iris_y = 0, 0
                for idx in self.eye_landmarks:
                    iris_x += landmarks[idx].x
                    iris_y += landmarks[idx].y

                iris_x /= len(self.eye_landmarks)
                iris_y /= len(self.eye_landmarks)

                # Draw circle at iris center
                x = int(iris_x * frame_w)
                y = int(iris_y * frame_h)
                cv2.circle(frame, (x, y), 5, (0, 255, 0), -1)

                # Convert to screen coordinates
                screen_x = self.screen_w * iris_x
                screen_y = self.screen_h * iris_y

                # Apply smoothing for cursor movement
                if self.prev_x == 0 and self.prev_y == 0:
                    self.prev_x, self.prev_y = screen_x, screen_y
                else:
                    screen_x = self.prev_x + self.smoothing_factor * (screen_x - self.prev_x)
                    screen_y = self.prev_y + self.smoothing_factor * (screen_y - self.prev_y)
                    self.prev_x, self.prev_y = screen_x, screen_y

                # Apply calibration
                screen_x, screen_y = self._apply_calibration(screen_x, screen_y)

                # Move cursor
                pyautogui.moveTo(int(screen_x), int(screen_y))

                tracking_data['cursor_x'] = screen_x
                tracking_data['cursor_y'] = screen_y

                # Mode-specific processing
                click_performed = False
                if self.mode == "blink":
                    # Improved blink detection
                    left_eye_upper = landmarks[159]  # Upper eyelid
                    left_eye_lower = landmarks[145]  # Lower eyelid
                    click_performed = self._process_blink(left_eye_upper, left_eye_lower, frame, frame_w, frame_h)
                else:  # dwell mode
                    click_performed = self._process_dwell(screen_x, screen_y, frame, frame_w, frame_h)

                tracking_data['click'] = click_performed

                # Check if we're calibrating and waiting for a blink to confirm point
                if self.is_calibrating and click_performed:
                    # Register current point for calibration
                    self.add_calibration_point(
                        (int(self.prev_x), int(self.prev_y)),  # Screen coordinates
                        (int(screen_x), int(screen_y))  # Eye coordinates
                    )

                # Emotion detection (only if enabled)
                if self.emotion_detection_enabled:
                    emotion = self._detect_emotion(frame)
                    tracking_data['emotion'] = emotion

            # Display blink counter and mode
            cv2.putText(frame, f"Blinks: {self.blink_counter}", (10, 90),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 0, 0), 2)
            cv2.putText(frame, f"Mode: {self.mode}", (10, 120),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 0, 0), 2)

            # Display controls info
            cv2.putText(frame, "Press 'q' to quit, 'm' to change mode", (10, frame_h - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)

            # Display the frame
            cv2.imshow('Eye Controlled Mouse', frame)

            # Emit tracking data to connected clients
            socketio.emit('eye_tracking', tracking_data)

            # Process key events
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                self.stop_tracking()
                break
            elif key == ord('m'):
                self.toggle_mode()
            elif key == ord('c'):
                self.start_calibration()

            # Short sleep to reduce CPU usage
            time.sleep(0.01)


# Create instance of eye tracker
eye_tracker = EyeTrackingServer()


# Flask routes
@app.route('/')
def index():
    return render_template('index.html')


# SocketIO event handlers
@socketio.on('connect')
def handle_connect():
    print('Client connected')
    socketio.emit('tracking_status', {'enabled': eye_tracker.is_tracking_enabled})


@socketio.on('start_tracking')
def handle_start_tracking():
    print('Start tracking requested')
    eye_tracker.start_tracking()


@socketio.on('stop_tracking')
def handle_stop_tracking():
    print('Stop tracking requested')
    eye_tracker.stop_tracking()


@socketio.on('toggle_mode')
def handle_toggle_mode():
    print('Mode toggle requested')
    eye_tracker.toggle_mode()


@socketio.on('start_calibration')
def handle_start_calibration():
    print('Calibration requested')
    eye_tracker.start_calibration()


@socketio.on('start_emotion_detection')
def handle_start_emotion_detection():
    print('Start emotion detection requested')
    eye_tracker.emotion_detection_enabled = True


@socketio.on('stop_emotion_detection')
def handle_stop_emotion_detection():
    print('Stop emotion detection requested')
    eye_tracker.emotion_detection_enabled = False


@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')


# HTML Template (to be saved in templates/index.html)
@app.route('/templates')
def get_template():
    html = '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Eye Tracking Control Panel</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
                line-height: 1.6;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 5px;
            }
            .status {
                padding: 10px;
                margin: 10px 0;
                border-radius: 5px;
            }
            .enabled {
                background-color: #d4edda;
                border: 1px solid #c3e6cb;
                color: #155724;
            }
            .disabled {
                background-color: #f8d7da;
                border: 1px solid #f5c6cb;
                color: #721c24;
            }
            button {
                padding: 10px 15px;
                margin: 5px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
            }
            .btn-primary {
                background-color: #007bff;
                color: white;
            }
            .btn-danger {
                background-color: #dc3545;
                color: white;
            }
            .btn-warning {
                background-color: #ffc107;
                color: black;
            }
            .btn-info {
                background-color: #17a2b8;
                color: white;
            }
            .settings {
                margin-top: 20px;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
            }
            .calibration-point {
                position: absolute;
                width: 20px;
                height: 20px;
                background-color: red;
                border-radius: 50%;
                transform: translate(-50%, -50%);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Eye Tracking Control Panel</h1>

            <div id="trackingStatus" class="status disabled">
                Tracking: Disabled
            </div>

            <div id="modeStatus" class="status">
                Mode: Blink
            </div>

            <div>
                <button id="startTracking" class="btn-primary">Start Tracking</button>
                <button id="stopTracking" class="btn-danger">Stop Tracking</button>
                <button id="toggleMode" class="btn-warning">Toggle Mode</button>
                <button id="startCalibration" class="btn-info">Calibrate</button>
            </div>

            <div class="settings">
                <h3>Statistics</h3>
                <p>Cursor position: <span id="cursorPos">X: 0, Y: 0</span></p>
                <p>Selections: <span id="clickCount">0</span></p>
                <p>Selection confidence: <span id="selectionConfidence">0%</span></p>
                <p>Emotion: <span id="emotion">None</span></p>
            </div>

            <div id="calibrationPoint" class="calibration-point" style="display:none;"></div>
        </div>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.0.1/socket.io.js"></script>
        <script>
            const socket = io();
            let clickCount = 0;

            // UI elements
            const trackingStatus = document.getElementById('trackingStatus');
            const modeStatus = document.getElementById('modeStatus');
            const cursorPos = document.getElementById('cursorPos');
            const clickCountElement = document.getElementById('clickCount');
            const selectionConfidence = document.getElementById('selectionConfidence');
            const emotionElement = document.getElementById('emotion');
            const calibrationPoint = document.getElementById('calibrationPoint');

            // Buttons
            document.getElementById('startTracking').addEventListener('click', () => {
                socket.emit('start_tracking');
            });

            document.getElementById('stopTracking').addEventListener('click', () => {
                socket.emit('stop_tracking');
            });

            document.getElementById('toggleMode').addEventListener('click', () => {
                socket.emit('toggle_mode');
            });

            document.getElementById('startCalibration').addEventListener('click', () => {
                socket.emit('start_calibration');
            });

            // Socket event handlers
            socket.on('tracking_status', (data) => {
                if (data.enabled) {
                    trackingStatus.textContent = 'Tracking: Enabled';
                    trackingStatus.className = 'status enabled';
                } else {
                    trackingStatus.textContent = 'Tracking: Disabled';
                    trackingStatus.className = 'status disabled';
                }
            });

            socket.on('mode_changed', (data) => {
                modeStatus.textContent = `Mode: ${data.mode.charAt(0).toUpperCase() + data.mode.slice(1)}`;
            });

            socket.on('eye_tracking', (data) => {
                if (data.tracking) {
                    cursorPos.textContent = `X: ${Math.round(data.cursor_x)}, Y: ${Math.round(data.cursor_y)}`;
                    selectionConfidence.textContent = `${Math.round(data.selection_confidence * 100)}%`;
                    emotionElement.textContent = data.emotion || 'None';

                    if (data.click) {
                        clickCount++;
                        clickCountElement.textContent = clickCount;
                    }
                }
            });

            socket.on('calibration_point', (data) => {
                calibrationPoint.style.display = 'block';
                calibrationPoint.style.left = data.x + 'px';
                calibrationPoint.style.top = data.y + 'px';
                alert(`Look at the red dot and blink to confirm (Point ${data.count}/${data.total})`);
            });

            socket.on('calibration_complete', (data) => {
                calibrationPoint.style.display = 'none';
                alert('Calibration complete!');
                console.log('Calibration results:', data);
            });

            socket.on('click_event', (data) => {
                console.log('Click event:', data.type);
            });
        </script>
    </body>
    </html>
    '''
    return html


if __name__ == '__main__':
    # Default directory for templates
    os.makedirs('templates', exist_ok=True)

    # Create the template file
    with open('templates/index.html', 'w') as f:
        f.write(get_template())

    print("Starting Eye Tracking Server...")
    print("Press Ctrl+C to quit")

    try:
        socketio.run(app, host='0.0.0.0', port=5000, debug=True, allow_unsafe_werkzeug=True)
    except KeyboardInterrupt:
        print("Shutting down...")
        eye_tracker.stop_tracking()