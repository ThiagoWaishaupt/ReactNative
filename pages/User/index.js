import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import PropTypes from "prop-types";
import api from "../../services/api";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
    Container,
    Header,
    Avatar,
    Bio,
    Name,
    Stars,
    Starred,
    OwnerAvatar,
    Info,
    Title,
    Author,
    TitleStars
} from "./styles";

export default function User(props) {
    const [stars, setStars] = useState([]);
    const [loading, setLoading] = useState(false);
    const { navigation } = props;
    const user = navigation.getParam("user");

    useEffect(() => {
        searchStars();
    }, []);

    async function searchStars() {
        setLoading(true);

        const { navigation } = props;
        const user = navigation.getParam("user");

        const response = await api.get(`users/${user.login}/starred`);
        setStars(response.data);

        setLoading(false);
    }

    return (
        <Container>
            <Header>
                <Avatar source={{ uri: user.avatar }} />
                <Name>{user.name}</Name>
                <Bio>{user.bio}</Bio>
            </Header>

            {loading ? (
                <ActivityIndicator color="#666" />
            ) : (
                <Stars
                    data={stars}
                    keyExtractor={star => String(star.id)}
                    renderItem={({ item }) => (
                        <Starred>
                            <OwnerAvatar
                                source={{ uri: item.owner.avatar_url }}
                            />
                            <Info>
                                <Title>{item.name}</Title>
                                <Author>{item.owner.login}</Author>
                            </Info>
                        </Starred>
                    )}
                />
            )}
        </Container>
    );
}

User.navigationOptions = ({ navigation }) => ({
    title: navigation.getParam("user").name,
    headerBackTitleVisible: false //Seta de voltar para o menu anterior com o titulo
});

User.propTypes = {
    navigation: PropTypes.shape({
        getParam: PropTypes.func
    }).isRequired
};
