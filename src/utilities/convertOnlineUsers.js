export const _convertOnlineUsers = (onlineUsers) => {
  const newObj = {};
  for (let i = 0; i < onlineUsers.length; i++) {
    if (newObj[onlineUsers[i]["username"]]) {
      newObj[onlineUsers[i]["username"]].push(onlineUsers[i]["socketid"]);
    } else {
      newObj[onlineUsers[i]["username"]] = [onlineUsers[i]["socketid"]];
    }
  }
  const objKeys = Object.keys(newObj).map((username) => ({
    username,
    sockets: newObj[username],
  }));
  return objKeys;
};
