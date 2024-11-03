export class User {
    static createFrom(json: User): any {
      throw new Error('Method not implemented.');
    }

    private id: number ;
    private firstname: string;
    private name: string;
    private role: string;
    private email: string | null ;
    private adresse: string | null;
    private tel: string;
    private mdp!: string;
  constructor(
    id: number ,name: string,firstname: string, role: string,email: string,tel: string = "",mdp: string,adresse: string | null = null // Default value for tel
) {
    this.firstname = firstname;
    this.name = name;
    this.role = role;
    this.adresse = adresse;
    this.email = this.validateEmail(email) ? email : null; // Validate email
    this.tel = tel;
    this.id = id;
    this.mdp = mdp;
  }

  private validateEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  }

  getId(){
    return this.id;
  }
  getName(){
    return this.name;
  }
  getFirstname(){
    return this.firstname;
  }
  getRole(){
    return this.role;
  }
  getEmail(){
    return this.email;
  }
  getAdresse(){
    return this.adresse;
  }
  getTel(){
    return this.tel;
  }

  changeName(name : string){
    this.name = name;
  }

  changeFirstname(firstname : string){
    this.firstname = firstname;
  }

  changeEmail(email : string){
    this.email = email;
  }

  changeAdresse(adresse : string){
    this.adresse = adresse;
  }

  changeTel(tel : string){
    this.tel = tel;
  }

  changeRole(role : string){
    this.role = role;
  }

  changePassword(password : string){
    this.role =password;
  }
  
}
