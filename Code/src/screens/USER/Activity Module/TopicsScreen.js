import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal, ActivityIndicator, TextInput, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import SERVER_CONFIG from '../../config';

export default function TopicsScreen() {
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedInfo, setEditedInfo] = useState(null);

    const displayFields = [
        { key: 'name', label: 'Name', icon: 'account', placeholder: 'Enter your name' },
        { key: 'age', label: 'Age', icon: 'calendar', placeholder: 'Enter your age', keyboardType: 'numeric' },
        { key: 'condition', label: 'Condition', icon: 'medical-bag', placeholder: 'Enter your condition' },
        { key: 'communicationMethod', label: 'Communication Method', icon: 'message-processing', placeholder: 'Enter your preferred communication method' },
        { key: 'familyInfo', label: 'Family Info', icon: 'account-group', placeholder: 'Enter your family information' },
        { key: 'likes', label: 'Likes', icon: 'thumb-up', placeholder: 'Enter things you like' },
        { key: 'dislikes', label: 'Dislikes', icon: 'thumb-down', placeholder: 'Enter things you dislike' }
    ];

    const topicCategories = [
        {
            id: 'aboutMe',
            title: 'About Me',
            icon: 'account',
            backgroundColor: '#2C3E50',
            items: [
                { name: 'My Info', icon: 'account-details' }
            ]
        },
        {
            id: 'bubbles',
            title: 'Bubbles',
            icon: 'message-text',
            backgroundColor: '#8E44AD',
            items: [
                { name: 'Greetings', icon: 'hand-wave', subitems: ["Hello!", "Good morning", "Goodbye", "Thank you", "Please help"] },
                { name: 'Questions', icon: 'help-circle', subitems: ["Where?", "When?", "Can you help me?", "What is this?", "I don't understand"] },
                { name: 'Answers', icon: 'check-circle', subitems: ["Yes", "No", "Maybe", "I need time", "All done"] },
                { name: 'Common Phrases', icon: 'text-box', subitems: ["I want to play", "I need a break", "Too loud", "Too quiet", "Different activity"] }
            ]
        },
        {
            id: 'myEmotions',
            title: 'My Emotions',
            icon: 'emoticon-outline',
            backgroundColor: '#E74C3C',
            items: [
                { name: 'Happy', icon: 'emoticon-happy', message: 'I am feeling happy' },
                { name: 'Sad', icon: 'emoticon-sad', message: 'I am feeling sad' },
                { name: 'Angry', icon: 'emoticon-angry', message: 'I am feeling angry' },
                { name: 'Excited', icon: 'emoticon-excited', message: 'I am feeling excited' },
                { name: 'Tired', icon: 'emoticon-tired', message: 'I am feeling tired' }
            ]
        },
        {
            id: 'needs',
            title: 'Needs',
            icon: 'hand-heart',
            backgroundColor: '#16A085',
            items: [
                { name: 'Food', icon: 'food', message: 'I need food' },
                { name: 'Drink', icon: 'cup-water', message: 'I need a drink' },
                { name: 'Rest', icon: 'sleep', message: 'I need rest' },
                { name: 'Help', icon: 'hand-pointing-up', message: 'I need help' }
            ]
        }
    ];

    const handleItemPress = async (category, item) => {
        setSelectedCategory(category);
        setSelectedItem(item);
        setSelectedMessage(null);
        setIsEditing(false);

        if (item.name === 'My Info') {
            setLoading(true);
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (!token) {
                    setUserInfo(null);
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`${SERVER_CONFIG.API_URL}/user-info`, {
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                });
                setUserInfo(response.data.data);
                setEditedInfo(response.data.data);
            } catch (error) {
                setUserInfo(null);
            } finally {
                setLoading(false);
            }
        }

        setModalVisible(true);
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.put(
              `${SERVER_CONFIG.API_URL}/update-profile`,
              editedInfo,
              {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }
            );

            if (response.data.status === 'ok') {
                setUserInfo(response.data.data);
                setIsEditing(false);
                Alert.alert('Success', 'Profile updated successfully');
            }
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const renderUserInfo = () => {
        return (
            <View style={styles.userInfoContent}>
                {displayFields.map((field) => (
                    <View key={field.key} style={styles.infoRow}>
                        <View style={styles.infoIconContainer}>
                            <MaterialCommunityIcons name={field.icon} size={22} color="#FFF" />
                        </View>
                        {isEditing ? (
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>{field.label}</Text>
                                <TextInput
                                    style={styles.infoInput}
                                    value={editedInfo[field.key]?.toString() || ''}
                                    onChangeText={(text) => setEditedInfo({ ...editedInfo, [field.key]: text })}
                                    placeholder={field.placeholder}
                                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                    keyboardType={field.keyboardType || 'default'}
                                />
                            </View>
                        ) : (
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>{field.label}</Text>
                                <Text style={styles.infoValue}>
                                    {userInfo[field.key] || 'Not specified'}
                                </Text>
                            </View>
                        )}
                    </View>
                ))}
            </View>
        );
    };

    const handleMessageSelect = (message) => {
        setSelectedMessage(message);
    };

    const renderModalContent = () => {
        if (!selectedItem) return null;

        if (selectedMessage) {
            return (
                <View style={[styles.modalContent, { backgroundColor: selectedCategory.backgroundColor }]}>
                    <MaterialCommunityIcons name={selectedItem.icon} size={50} color="#FFF" />
                    <Text style={styles.modalMessage}>{selectedMessage}</Text>
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => setSelectedMessage(null)}
                    >
                        <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (selectedItem.subitems) {
            return (
                <View style={[styles.modalContent, { backgroundColor: selectedCategory.backgroundColor }]}>
                    <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                    <View style={styles.gridContainer}>
                        {selectedItem.subitems.map((message, index) => (
                            <TouchableOpacity 
                                key={index}
                                style={styles.gridItem}
                                onPress={() => handleMessageSelect(message)}
                            >
                                <Text style={styles.gridItemText}>{message}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            );
        }

        if (selectedCategory.id === 'aboutMe') {
            return (
                <View style={[styles.modalContent, { backgroundColor: selectedCategory.backgroundColor, height: 'auto' }]}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#FFF" />
                    ) : (
                        <View style={styles.userInfoContainer}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>My Information</Text>
                                {!isEditing ? (
                                    <TouchableOpacity 
                                        style={styles.editButton} 
                                        onPress={() => setIsEditing(true)}
                                    >
                                        <MaterialCommunityIcons name="pencil" size={20} color="#FFF" />
                                        <Text style={styles.buttonText}>Edit</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <View style={styles.buttonContainer}>
                                        <TouchableOpacity 
                                            style={[styles.actionButton, styles.cancelButton]} 
                                            onPress={() => {
                                                setEditedInfo(userInfo);
                                                setIsEditing(false);
                                            }}
                                        >
                                            <Text style={styles.buttonText}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={[styles.actionButton, styles.saveButton]} 
                                            onPress={handleUpdate}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <ActivityIndicator color="#FFF" size="small" />
                                            ) : (
                                                <Text style={styles.buttonText}>Save</Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                            {userInfo ? (
                                <ScrollView 
                                    style={styles.userInfoScrollView}
                                    contentContainerStyle={styles.scrollViewContent}
                                    showsVerticalScrollIndicator={true}
                                >
                                    {renderUserInfo()}
                                </ScrollView>
                            ) : (
                                <Text style={styles.errorMessage}>Failed to load user information</Text>
                            )}
                        </View>
                    )}
                </View>
            );
        }

        return (
            <View style={[styles.modalContent, { backgroundColor: selectedCategory.backgroundColor }]}>
                <MaterialCommunityIcons name={selectedItem.icon} size={50} color="#FFF" />
                <Text style={styles.modalMessage}>{selectedItem.message || selectedItem.name}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Topics</Text>
                <Text style={styles.headerSubtitle}>Browse and learn communication topics</Text>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.categoryContainer}>
                {topicCategories.map((category) => (
                    <View
                        key={category.id}
                        style={[styles.categoryCard, { backgroundColor: category.backgroundColor }]}
                    >
                        <View style={styles.categoryHeader}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons 
                                    name={category.icon} 
                                    size={26} 
                                    color="#FFF"
                                />
                            </View>
                            <Text style={styles.categoryTitle}>{category.title}</Text>
                        </View>
                        
                        <View style={styles.itemsContainer}>
                            {category.items.map((item, index) => (
                                <TouchableOpacity 
                                    key={index}
                                    style={styles.itemButton}
                                    onPress={() => handleItemPress(category, item)}
                                >
                                    <MaterialCommunityIcons 
                                        name={item.icon} 
                                        size={18} 
                                        color="#FFF"
                                        style={styles.itemIcon}
                                    />
                                    <Text style={styles.itemText}>{item.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}
            </ScrollView>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                    setSelectedMessage(null);
                    setUserInfo(null);
                    setIsEditing(false);
                }}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay}
                    activeOpacity={1} 
                    onPress={() => {
                        if (!selectedMessage && !isEditing) {
                            setModalVisible(false);
                            setSelectedMessage(null);
                            setUserInfo(null);
                            setIsEditing(false);
                        }
                    }}
                >
                    {renderModalContent()}
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 8,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#666',
        marginTop: 1,
    },
    scrollView: {
        flex: 1,
        paddingTop: 0,
    },
    categoryContainer: {
        padding: 6,
        paddingBottom: 0,
        paddingTop: 3,
    },
    categoryCard: {
        borderRadius: 15,
        marginBottom: 6,
        padding: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    categoryTitle: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#FFF',
    },
    itemsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: -5,
        marginRight: -5,
    },
    itemButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 8,
        padding: 9,
        margin: 5,
        minWidth: '45%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    itemIcon: {
        marginRight: 8,
    },
    itemText: {
        color: '#FFF',
        fontSize: 14.5,
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        width: '85%',
        maxHeight: '80%',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    userInfoContainer: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF',
    },
    modalMessage: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
        marginTop: 20,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
    },
    gridItem: {
        width: '48%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    gridItemText: {
        color: '#FFF',
        fontSize: 16,
        textAlign: 'center',
    },
    backButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 8,
    },
    backButtonText: {
        color: '#FFF',
        fontSize: 16,
    },
    userInfoScrollView: {
        width: '100%',
        flex: 1,
    },
    scrollViewContent: {
        paddingBottom: 10,
    },
    userInfoContent: {
        width: '100%',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
    },
    infoIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
    infoInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 8,
        padding: 8,
        color: '#FFF',
        fontSize: 16,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    actionButton: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 8,
        marginLeft: 10,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
    },
    cancelButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    buttonText: {
        color: '#FFF',
        marginLeft: 5,
        fontWeight: '500',
    },
    errorMessage: {
        color: '#FFF',
        fontSize: 16,
        textAlign: 'center',
    }
});