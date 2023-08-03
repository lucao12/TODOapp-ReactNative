import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableWithoutFeedback, TouchableOpacity, Alert, Keyboard, FlatList } from "react-native";
import Login from "./src/Components/Login";
import TaskList from "./src/Components/TaskList";
import firebase from "./src/Services/firebaseConection";
import Feather from 'react-native-vector-icons/Feather'

export default function App(){

  const [user, setUser] = useState(null);
  const [newTask, setNewTask] = useState('');
  const inputTarefa = useRef(null);
  const [lista, setLista] = useState([]);
  const [key, setKey] = useState('');

  useEffect(()=>{
    function pegaTarefas(){
      if(!user){
        return;
      }
      firebase.database().ref('tarefas').child(user).once('value', (snapshot) => {

          setLista([]);
          
          snapshot?.forEach((childItem)=>{
            let data = {
              key: childItem.key,
              nome: childItem.val().nome
            };
            setLista(oldLista => [...oldLista, data]);
          })
      })
    }

    pegaTarefas();

  }, [user]);

  function sairFoco(){
    inputTarefa.current?.blur();
  }

  function deletar(key){
    firebase.database().ref('tarefas').child(user).child(key).remove()
    .then(() => {
      const fintTaks = lista.filter( item => item.key !== key );
      setLista(fintTaks);
    })
  }

  function editar(data){
    setKey(data.key);
    setNewTask(data.nome);
    inputTarefa.current?.focus();
  }

  function cancelaEditar(){
    setKey('');
    setNewTask('');
    inputTarefa.current?.blur();
    Keyboard.dismiss();
  }

  function adicionar(){
    Keyboard.dismiss();
    console.log("user1:", user);
    if(newTask === ''){
      Alert.alert('CUIDADO!','Tarefa vazia, favor adicionar algo!');
      console.log("user2:", user);
      return;
    }
    if(key !== ''){
      console.log("user3:", user);
      firebase.database().ref('tarefas').child(user).child(key).update({
        nome: newTask
      })
      .then(()=>{
        const taskIndex = lista.findIndex(item => item.key === key);
        const taskClone = lista;
        taskClone[taskIndex].nome = newTask;

        setLista([...taskClone]);
      })
      Keyboard.dismiss();
      setKey('');
      setNewTask('');
      return;
    }
    console.log("user4:", user);
    try {
      console.log("user5:", user);
      let tarefas = firebase.database().ref('tarefas').child(user);
      console.log("user:", user);
      let chave = tarefas.push().key;

      tarefas.child(chave).set({
        nome: newTask
      });
      const data = {
        key: chave,
        nome: newTask
      };

      setLista(oldLista => [...oldLista, data]);
    } catch (error) {
      Alert.alert('ERRO!', 'Algo deu errado!');
      setNewTask('');
      return;
    }
    setNewTask('');
  }

  if(!user){
    return <Login mudaStatus={(uid) => setUser(uid)}/>
  }

  return(

    <TouchableWithoutFeedback 
    onPress={sairFoco}>

      <SafeAreaView 
      style={styles.container}>

        {key.length > 0 && (<View 
        style={{flexDirection: 'row', marginBottom: 8, height: '9%', width: '100%'}}>
          <TouchableOpacity
          onPress={cancelaEditar}>
            <Feather name="x-circle" size={20} color="#F00"/>
          </TouchableOpacity>
          <Text
          style={{marginLeft: 5, color: '#F00', textAlign: 'auto'}}>
            Você está editando uma tarefa!
          </Text>
        </View>)}

        <View
        style={styles.containerTaks}>

          <TextInput
          placeholder="Insira nova tarefa"
          placeholderTextColor='#141414'
          style={styles.input}
          ref={inputTarefa}
          value={newTask}
          onChangeText={(texto) => setNewTask(texto)}
          />
          <TouchableOpacity
          style={styles.areaBotao}
          onPress={adicionar}>
            <Text
            style={styles.textoMais}>
              +
            </Text>
          </TouchableOpacity>

        </View>

        <FlatList
        data={lista}
        keyExtractor={(item) => item.key}
        renderItem={({item})=> (
          <TaskList data={item} deleteItem={deletar} editaItem={editar}/>
        )}/>

      </SafeAreaView>

    </TouchableWithoutFeedback>

  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    paddingHorizontal: 10,
    backgroundColor: '#F2F6FC'
  },
  containerTaks:{
    flexDirection: 'row',
  },
  input:{
    flex: 1,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#141414',
    color: '#141414',
    height: 45
  },
  areaBotao:{
    backgroundColor: '#141414',
    height: 45,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    marginLeft: 5,
    borderRadius: 4,
  },
  textoMais:{
    color: '#FFF',
    fontSize: 22,
  },
});