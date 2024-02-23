let onlineUsers = [];

const SocketServer = (socket, io) => {
  // user joins or opens the application
  socket.on('join', (user) => {
    socket.join(user);
    // add joined user to online users
    if (!onlineUsers.some((u) => u.userId === user)) {
      onlineUsers.push({ userId: user, socketId: socket.id });
    }
    //send online users to client
    io.emit('get-online-users', onlineUsers);
    // send socket id
    io.emit('setup socket', socket.id);
  });

  // socket disconnect
  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit('end call');
    io.emit('get-online-users', onlineUsers);
  });

  //join a conversation room
  socket.on('join conversation', (conversation) => {
    socket.join(conversation);
  });

  //send and receive message
  socket.on('send message', (message) => {
    let conversation = message.conversation;
    if (!conversation.users) return;
    conversation.users.forEach((user) => {
      if (user._id === message.sender._id) return;
      socket.in(user._id).emit('received message', message);
    });
  });

  //typing
  socket.on('typing', (conversation) => {
    socket.in(conversation).emit('typing', conversation);
  });
  socket.on('stop typing', (conversation) => {
    socket.in(conversation).emit('stop typing');
  });

  // call
  //-----call user
  socket.on('call user', (data) => {
    console.log(data.signal);
    let userId = data.userToCall;
    let userSocketId = onlineUsers.find((user) => user.userId === userId);

    io.to(userSocketId.socketId).emit('call user', {
      signal: data.signal,
      from: data.from,
      name: data.name,
      picture: data.picture,
    });
  });
  //---ansưer call
  socket.on('answer call', (data) => {
    console.log(
      'ths is a iddsdddddgfggsdgdgf;alkskjfklasjflkkjlashfklahfslkj',
      data.to
    );
    let userSocketId = onlineUsers.find((user) => user.userId === data.to);
    io.to(userSocketId.socketId).emit('call accepted', data.signal);
  });

  //--- end call
  socket.on('end call', (data) => {
    let userSocketId = onlineUsers.find((user) => user.userId === data.userId);

    io.to(userSocketId.socketId).emit('end call');
  });
};
export default SocketServer;
