import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  userForm = {
    name: '',
    email: '',
    description: '',
    image: ''
  };

  users: any[] = [];
  isEditing = false;
  editingEmail = '';
  formcontrol = true
  postcontrol = false

  constructor() {
    const stored = localStorage.getItem('users');
    this.users = stored ? JSON.parse(stored) : [];
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.userForm.image = reader.result as string;
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.isEditing) {
      this.users = this.users.map(user =>
        user.email === this.editingEmail
          ? { ...user, image: this.userForm.image, description: this.userForm.description }
          : user
      );
    } else {
      const exists = this.users.some(user => user.email === this.userForm.email);
      if (exists) {
        alert('User with this email already exists.');
        return;
      }
      this.users.push({ ...this.userForm, showActions: false });
    }

    localStorage.setItem('users', JSON.stringify(this.users));
    alert('Post added successfully!')
    this.resetForm();
  }

  editUser(user: any) {
    this.isEditing = true;
    this.editingEmail = user.email;
    this.userForm = { ...user };
    this.formcontrol = true
    this.postcontrol = false
  }

  deleteUser(email: string) {
    this.users = this.users.filter(user => user.email !== email);
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  resetForm() {
    this.userForm = {
      name: '',
      email: '',
      description: '',
      image: ''
    };
    this.isEditing = false;
    this.editingEmail = '';
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  formvalid() {
    return this.userForm.name && this.userForm.email && this.userForm.description && this.userForm.image;
  }
  addpost(){
    this.formcontrol = true
    this.postcontrol = false
  }
  watchpost(){
    this.formcontrol = false
    this.postcontrol = true
  }
}
