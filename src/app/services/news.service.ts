import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private baseUrl = `https://hacker-news.firebaseio.com/v0/`;
  private topStoriesUrl = `${this.baseUrl}topstories.json`;
  private storeUrl = storyId => `${this.baseUrl}item/${storyId}.json`;
  // This is your storage variable name
  private stories = 'stories';
  private start = 'start';
  private end = 'end';
  private searchStart = 'searchStart';
  private searchEnd = 'searchEnd';
  private searchStatus = 'searchStatus';
  private search = 'search';
  private storiesCacheObject = {};

  constructor(private http: HttpClient) {
    let storiesCacheObject = JSON.parse(localStorage.getItem(this.stories));
    // there are no stories in cache, initialize cache
    if (!storiesCacheObject) {
      localStorage.setItem(this.stories, JSON.stringify(this.storiesCacheObject));
    }
    // if cache exists in localStorage, assign value to member variable
    if (storiesCacheObject) {
      this.storiesCacheObject = storiesCacheObject;
    }
    let searchStatus = JSON.parse(localStorage.getItem(this.searchStatus));
    if (!searchStatus) {
      localStorage.setItem(this.searchStatus, JSON.stringify(false));
    }
  }

  getTopStories(): Observable<number[]> {
    return this.http.get<number[]>(this.topStoriesUrl)
      .pipe(map(response => response));
  }

  getStory(id: Number, bypassCache?: any): Observable<any> {
    if (!bypassCache && this.storiesCacheObject && Object.keys(this.storiesCacheObject).length && this.storiesCacheObject.hasOwnProperty(`${id}`)) {
      return of(
        this.storiesCacheObject[`${id}`]
      );
    }
    // if we do not find the story in cache or we intentionally want to overwrite value of key, hit endpoint and cache result
    return this.http.get<number>(this.storeUrl(id))
      .pipe(map(response => {
        this.storiesCacheObject[response['id']] = response
        localStorage.setItem(this.stories, JSON.stringify(this.storiesCacheObject));
        return response
      })
      );
  }

  getTopNewsPage(){
    const start = JSON.parse(localStorage.getItem(this.start));
    const end = JSON.parse(localStorage.getItem(this.end));
    return {'start': start, 'end': end}

  }
  persistTopNewsPage(start:Number, end: Number): void{
    localStorage.setItem(this.start, JSON.stringify(start));
    localStorage.setItem(this.end, JSON.stringify(end));
    localStorage.setItem(this.searchStatus, JSON.stringify(false));
  }
  
  getSearchResultsPage(){
    const start = JSON.parse(localStorage.getItem(this.searchStart));
    const end = JSON.parse(localStorage.getItem(this.searchEnd));
    return {'searchStart': start, 'searchEnd': end}
    
  }
  persistSearchResultsPage(start:Number, end: Number): void{
    localStorage.setItem(this.searchStart, JSON.stringify(start));
    localStorage.setItem(this.searchEnd, JSON.stringify(end));
    localStorage.setItem(this.searchStatus, JSON.stringify(true));
  }
  getSearchStatus(){
    const searchStatus = JSON.parse(localStorage.getItem(this.searchStatus));
    return searchStatus
  }
  
  persistSearch(searchText){
    localStorage.setItem(this.search, JSON.stringify(searchText));
    localStorage.setItem(this.searchStatus, JSON.stringify(true));
  }
  getSearch(){
    const search = JSON.parse(localStorage.getItem(this.search));
    return search
  }
}
