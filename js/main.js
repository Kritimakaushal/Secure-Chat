window.onload = () => {
  const key = window.sessionStorage.getItem('uuid')
  if(key) {
    document.getElementById('unique_key_container').style.display = 'block';
    document.getElementById('id_form').style.display = 'none';
    document.getElementById('unique_key').innerHTML = key;

    // fetch saved chats and accorindgly show hide the content inside the modal 
    db.collection('savedChats').doc(key).get()
    .then(doc => {
      document.getElementById('chats_container').style.display = 'block';
      document.getElementById('fetch_chat_form').style.display = 'none';
      if(doc.exists) {
        // data is there
        console.log('The document: ', doc.data());
        document.getElementById('saved_chats_list').innerHTML = JSON.stringify(doc.data());
        // TODO: To render the saved chats as a list
      } else {
        document.getElementById('saved_chats_list').innerHTML = 'The document does not exist';
      }
    })
    .catch(err => {
      console.log('Here is the error: ', err)
    })
  }
}

document.getElementById('clear_unique_key').addEventListener('click', () => {
  clearKey();
})

const clearKey = () => {
  window.sessionStorage.removeItem('uuid');
  document.getElementById('unique_key_container').style.display = 'none';
  document.getElementById('id_form').style.display = 'block';
  location.reload();
}

document.getElementById('generate_unique_key').addEventListener('click', (event) => {
    // disable the button
    event.target.disabled = true;
    // show the loader
    document.getElementById('generate_unique_key_loader').style.visibility = 'visible';
    // get the values
    const nickName = document.getElementById('nick_name').value;
    
    // string 
    const text = `${nickName}_${new Date().getTime()}`
    // get the encrypted value
    const key = encrypt((new Date).getTime(), text);

    // save the key locally for the session 
    window.sessionStorage.setItem('uuid', key);
    // store the key in the Firebase collection
    db.collection("savedChats").doc(key).set({
      nickName: nickName,
      timeInitialised: (new Date()).getTime(),
      savedChats: []
    }, {merge: true})
    .then(data => {
      // enable the button
      event.target.disabled = false;
      // hide the loader
      document.getElementById('generate_unique_key_loader').style.visibility = 'hidden';
      // set the value on UI
      document.getElementById('unique_key_container').style.display = 'block';
      document.getElementById('id_form').style.display = 'none';
      document.getElementById('unique_key').innerHTML = key;
      console.log('Inserted successfully')
    })
    .catch(err => {
      console.log('There was some error')
    })
})


document.getElementById('fetch_chat').addEventListener('click', (event) => {
  // disable the button
  event.target.disabled = true;
  // show the loader
  document.getElementById('fetch_chat_loader').style.visibility = 'visible';
  // get the values
  const uniqueKey = document.getElementById('previous_key').value;

  // fetch the data from the firestore using the given key

  db.collection('savedChats').doc(uniqueKey).get()
  .then(doc => {
    console.log('Doc: ', doc)

    // save the key locally for the session 
    window.sessionStorage.setItem('uuid', uniqueKey);
    
    // enable the button
    event.target.disabled = false;
    // hide the loader
    document.getElementById('fetch_chat_loader').style.visibility = 'hidden';
    // set the value on UI
    document.getElementById('chats_container').style.display = 'block';
    document.getElementById('fetch_chat_form').style.display = 'none';
    document.getElementById('saved_chats_list').innerHTML = JSON.stringify(doc);
  })
  .catch(err => {
    console.log('Here is the error: ', err)
  })
})


document.getElementById('fetch_chat_modal').addEventListener('click', (event) => {
  const key = window.sessionStorage.getItem('uuid')
  if(key) {
    // fetch saved chats and accorindgly show hide the content inside the modal 
    db.collection('savedChats').doc(key).get()
    .then(doc => {
      document.getElementById('chats_container').style.display = 'block';
      document.getElementById('fetch_chat_form').style.display = 'none';
      if(doc.exists) {
        // data is there
        console.log('The document: ', doc.data());
        document.getElementById('saved_chats_list').innerHTML = JSON.stringify(doc.data());
        // TODO: To render the saved chats as a list
      } else {
        document.getElementById('saved_chats_list').innerHTML = 'The document does not exist';
      }
    })
    .catch(err => {
      console.log('Here is the error: ', err)
    })
  }
})
