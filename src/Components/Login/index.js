import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableWithoutFeedback, TouchableOpacity, Alert, Keyboard } from "react-native";
import firebase from "../../Services/firebaseConection";

export default function Login({mudaStatus}){

    const [type, setType] = useState('Login');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const inputEmail = useRef(null);
    const inputSenha = useRef(null);

    useEffect(()=>{
        setEmail('');
        setSenha('');
    }, [])

    function sairFoco(){
        inputEmail.current?.blur();
        inputSenha.current?.blur();
    }

    async function login(){
        Keyboard.dismiss();
        if(email !== '' && senha !== ''){
            try {
                const user = await firebase.auth().signInWithEmailAndPassword(email, senha);
                const userID = user.user.uid;
                mudaStatus(userID);
            } catch (error) {
                Alert.alert('ERRO!','Ops, algo deu errado');
                setEmail('');
                setSenha('');
                return;
            }
        }
        Alert.alert('Sucesso!','Logado com sucesso!');
        setEmail('');
        setSenha('');
    }

    async function cadastro(){
        Keyboard.dismiss();
        if(email !== '' && senha !== ''){
            try {
                const user = await firebase.auth().createUserWithEmailAndPassword(email, senha);
                const userID = user.user.uid;
                mudaStatus(userID);
            } catch (error) {
                Alert.alert('ERRO!','Ops, algo deu errado');
                setEmail('');
                setSenha('');
                return;
            }
        }
        Alert.alert('Sucesso!','Cadastrado com sucesso!');
        setEmail('');
        setSenha('');
    }

  return(

    <TouchableWithoutFeedback onPress={sairFoco}>

        <SafeAreaView style={styles.container}>

            <Text style={[styles.textoLogin, {color: type !== 'Login' ? '#B22222' : '#3ea4f2'}]}>
                {type !== 'Login' ? 'Cadastro' : 'Login'}
            </Text>

            <TextInput
            placeholder="Insira seu Email: "
            placeholderTextColor='#141414'
            style={styles.input}
            value={email}
            onChangeText={(texto) => setEmail(texto)}
            underlineColorAndroid='transparent'
            ref={inputEmail}/>

            <TextInput
            placeholder="Insira sua Senha: "
            placeholderTextColor='#141414'
            style={styles.input}
            value={senha}
            secureTextEntry={true}
            onChangeText={(texto) => setSenha(texto)}
            underlineColorAndroid='transparent'
            ref={inputSenha}/>

            <TouchableOpacity 
            style={[styles.areaBotao, {backgroundColor: type !== 'Login' ? '#B22222' : '#3ea4f2'}]}
            onPress={type !== 'Login' ? cadastro : login}
            >

                <Text style={styles.texto}>
                    {type !== 'Login' ? 'Cadastrar' : 'Acessar'}
                </Text>

            </TouchableOpacity>

            <TouchableOpacity onPress={() => setType(type => type !== 'Login' ? 'Login' : 'Cadastrar')}>

                <Text style={{textAlign: 'center', color: '#141414'}}>
                    {type !== 'Login' ? 'Já possuo uma conta' : 'Criar uma conta'}    
                </Text>

            </TouchableOpacity>

        </SafeAreaView>

    </TouchableWithoutFeedback>

  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F6FC',
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  textoLogin:{
    textAlign: 'center',
    fontSize: 30,
    paddingBottom: 5,
    fontWeight: 'bold'
  },
  input:{
    marginBottom: 10,
    backgroundColor: '#FFF',
    borderRadius: 4,
    height: 45,
    padding: 10,
    borderWidth: 1,
    borderColor: '#141414',
    color: '#141414',
  },
  areaBotao:{
    //alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    marginBottom: 10,
  },
  texto:{
    color: '#fff',
    fontSize: 17,
    textAlign: 'center',
  },

});