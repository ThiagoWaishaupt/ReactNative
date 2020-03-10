import React, { useState, useEffect } from "react";
import { Keyboard, ActivityIndicator, AsyncStorage } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import PropTypes from "prop-types";
// import AsyncStorage from "@react-native-community/async-storage";
import {
    Container,
    Form,
    Input,
    SubmitButton,
    List,
    User,
    Avatar,
    Name,
    Bio,
    ProfileButton,
    ProfileButtonText,
    TextVazio
} from "./styles";
import api from "../../services/api";

export default function Main(props) {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        searchUsers();
    }, []);

    useEffect(() => {
        AsyncStorage.setItem("users", JSON.stringify(users));
    }, [users]);

    async function searchUsers() {
        const users = await AsyncStorage.getItem("users");

        if (users) {
            setUsers(JSON.parse(users));
        }
    }

    function handleNavigation(user) {
        const { navigation } = props;

        navigation.navigate("User", { user });
    }

    function handleDelete(user) {
        const data = users.filter(u => u.login !== user.login);

        setUsers(data);

        alert(`${user.name} excluído.`);
    }

    async function handleAddUser() {
        setLoading(true);

        try {
            const response = await api.get(`/users/${newUser}`);
        } catch (error) {
            console.tron.log(error);
        }

        const data = {
            name: response.data.name,
            login: response.data.login,
            bio: response.data.bio,
            avatar: response.data.avatar_url
        };

        setUsers([...users, data]);
        setNewUser("");

        Keyboard.dismiss();
    }

    return (
        <>
            <Container>
                <Form>
                    <Input
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholder="Adicionar usuário"
                        value={newUser}
                        onChangeText={text => setNewUser(text)}
                        returnKeyType="send"
                        onSubmitEditing={handleAddUser}
                    />
                    <SubmitButton loading={loading} onPress={handleAddUser}>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Icon name="add" size={20} color="#fff" />
                        )}
                    </SubmitButton>
                </Form>

                {users.length === 0 ? (
                    <TextVazio>Vazio</TextVazio>
                ) : (
                    <List
                        data={users}
                        keyExtractor={user => user.login}
                        renderItem={({ item }) => (
                            <User>
                                <Avatar source={{ uri: item.avatar }} />
                                <Name>{item.name}</Name>
                                <Bio>{item.bio}</Bio>

                                <ProfileButton
                                    onPress={() => handleNavigation(item)}
                                >
                                    <ProfileButtonText>
                                        Ver Perfil
                                    </ProfileButtonText>
                                </ProfileButton>
                                <Icon
                                    name="delete"
                                    size={28}
                                    color="#999"
                                    onPress={() => handleDelete(item)}
                                />
                            </User>
                        )}
                    />
                )}
            </Container>
        </>
    );
}

Main.navigationOptions = {
    title: "Usuários",
    headerBackTitleVisible: false //Seta de voltar para o menu anterior com o titulo
};

Main.propTypes = {
    navigation: PropTypes.shape({
        navigate: PropTypes.func
    }).isRequired
};
