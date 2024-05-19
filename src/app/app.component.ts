import { Component, OnInit } from '@angular/core';
import { PostService } from './services/post.service';
import { Route, RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'appTaxi';
  postData = {
    targa: ''
  };
  
  constructor(private service:PostService, private router: Router) {}
  ngOnInit(): void {
    if(!sessionStorage.getItem('passeggero') && !sessionStorage.getItem('tassista' ))
        this.router.navigate(['/home']);
  }
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
