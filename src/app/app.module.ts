import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewsService } from './services/news.service';
import { StoryItemComponent } from './components/story-item/story-item/story-item.component';

@NgModule({
  declarations: [
    AppComponent,
    StoryItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule
  ],
  providers: [NewsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
