export default class Client {

  static totalClients = 0; 
  static clients = []; 

  id;
  name;
  email;
  #password; 
  

  constructor(id, name, email, password) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.#password = password;

    Client.totalClients++;
    Client.clients.push(this);
  }

  getEmail() {
    return this.email;
  }

  verifyPassword(pwd) {
    return this.#password === pwd;
  }


  clone() {
    return new Client(
      this.id,
      this.name,
      this.email,
      this.#password
    );
  }


  // MEMENTO: guardar/restaurar estado
  createMemento() {
    return {
      id: this.id,
      name: this.name,
      email: this.email
      // no guardamos password por seguridad
    };
  }

  restore(memento) {
    this.id = memento.id;
    this.name = memento.name;
    this.email = memento.email;
  }
}
