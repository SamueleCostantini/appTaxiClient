/** Script pagina app-component */
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
    //se session storage vuoto la pagina app-component redirect alla home
    if(sessionStorage.length == 0)
        this.router.navigate(['/home']);
  }
  //test
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
