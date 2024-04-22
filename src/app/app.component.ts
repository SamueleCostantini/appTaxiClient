import { Component, OnInit } from '@angular/core';
import { PostService } from './services/post.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
  title = 'appTaxi';
  postData = {
    targa: ''
  };
  
  constructor(private service:PostService) {}
  
  createPost() {
    this.service.createPost(this.postData).subscribe(
      response => {
        console.log('Post created successfully:', response);
         alert('Post created successfully');
      },
      error => {
        console.error('Error creating post:', error);
      }
    );
  }
}
