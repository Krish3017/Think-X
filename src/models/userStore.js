const users = [];

export const userStore = {
  create(user) {
    const newUser = {
      id: Date.now().toString(),
      ...user,
      createdAt: new Date(),
    };
    users.push(newUser);
    return newUser;
  },

  findByEmail(email) {
    return users.find(user => user.email === email);
  },

  findById(id) {
    return users.find(user => user.id === id);
  },

  getAll() {
    return users;
  }
};
