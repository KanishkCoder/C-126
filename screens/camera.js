import * as React from 'react';
import {Button, View, Platform} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions'

export default class PickImage extends React.Component{
    state = {
        image: null,
    };

    render(){
        let { image }= this.state;
        
        return(
            <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                <Button
                title = "Pick an Image from camera roll"
                onPress={this._pickImage}
                />
            </View>
        )
    }

    componentDidMount(){
        this.getPermissionsAsync()
    }

    getPermissionsAsync = async () =>{
        if(Platform.OS !== "web"){
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if(status !== "granted"){
                alert("Sorry, We need camera roll permissions to make this work!")
            }
        }
    }

    uploadImage = async (uri) => {
        const data = new FormData();
        let filename = uri.split('/')[uri.split('/').length-1]
        let type = `image/${uri.split('.')[uri.split('.').length-1]}`
        const fileToUpload = {
            uri: uri,
            name: filename,
            type: type,
        };
        data.append("digit", fileToUpload);
        fetch("https://bcb7-117-217-41-46.ngrok.io/Predict-digit", {
            method: "POST",
            body: data,
            headers: {"content-type": "multipart/form-data"},
            
        })
    }

    _pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true, 
                aspect: [4, 3],
                quality: 1,
            });
            if(!result.cancelled){
                this.setState({ image: result.data });
                console.log(result.uri)
                this.uploadImage(result.uri);
            }
        } catch (E) {
            console.log(E)
        }
    }
}
