const users=[];

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();//removes white spaces and convets to lower case
  room = room.trim().toLowerCase();

  const existingUser=users.find((user)=>user.room===room&&user.name===name)//if a second user tries to join the same room with the same username
  if(existingUser){
      return {error:"Username is taken"}
  }

  const user={id, name, room}
  users.push(user)
  return {user}
};

const removeUser=(id)=>{
    const index=users.findIndex((user)=>user.id===id)
    if(index!=-1){
      return users.splice(index, 1)[0]//removes 1 element starting from index
    }
}

const getUser=(id)=>(
  users.find((user)=>user.id===id)
)

const getUsersInRoom=(room)=>(
  users.filter((user)=>user.room===room)
)

module.exports={addUser,removeUser,getUser,getUsersInRoom}
