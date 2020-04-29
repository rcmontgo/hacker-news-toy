import { Component, OnInit } from '@angular/core';
import { debounce } from 'lodash';
import { NewsService } from './services/news.service';
import { faSearch, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'hacker-news-toy';
  faSearch = faSearch;
  faTimesCircle = faTimesCircle;
  private INIT_START = 0
  private INIT_END = 30
  public topStoryIds = [];
  public stories = [];
  public filteredStories = [];
  public storyId;
  public start = this.INIT_START
  public end = this.INIT_END
  public searchStart = this.INIT_START
  public searchEnd = this.INIT_END
  public pageDisplayCount = 30
  public fetchingStories = false;
  public hideNextOption = false;
  public searchValue = null;
  public searching = false;

  constructor(private newsService: NewsService) {}
  
  ngOnInit() {
    this.search = debounce(this.search, 500)

    this.newsService.getTopStories()
      .subscribe(res => {
        if (res && res.length) {
          this.topStoryIds = res
          this.fetchAllStories()
        }
        const searchStatus = this.newsService.getSearchStatus()
        if(searchStatus){
          this.searching = searchStatus
          const { searchStart, searchEnd} = this.newsService.getSearchResultsPage()
          this.searchValue = this.newsService.getSearch()
          this.searchStart = searchStart
          this.searchEnd = searchEnd
          this.applySearchFilter()
        } 
        if(!searchStatus && typeof searchStatus === 'boolean') {
          const { start, end} = this.newsService.getTopNewsPage()
          this.start = start
          this.end = end
        }
      })
  }

  // since we want to support search, we need to go ahead and fetch all stories per id and put them in memory
  fetchAllStories() {
    this.stories = []
    this.fetchingStories = true;
    this.topStoryIds.forEach(storyId => {
      this.fetchStory(storyId)
    })
    this.fetchingStories = false;
  }

  // per pagination story fetch, should hit cache and fall back to network request when necessary
  fetchStories() {
    this.fetchingStories = true;
    this.topStoryIds.slice(this.start, this.end + 1).forEach(storyId => {
      this.fetchStory(storyId)
    })
    this.fetchingStories = false;
  }

  fetchStory(storyId) {
    if (!storyId && storyId != 0) {
      // raise error
    }
    this.newsService.getStory(storyId)
      .subscribe(story => {
        this.stories.push(story)
      })
  }

  topStories() {
    this.hideNextOption = false
    this.resetSearchForm()
    this.searching = false
    this.start = this.INIT_START
    this.end = this.INIT_END
    this.newsService.persistTopNewsPage(this.start, this.end)
    // find any new stories
    this.newsService.getTopStories()
      .subscribe(res => {
        if (res && res.length) {
          this.topStoryIds = res
          this.fetchStories()
        }
    })
  }

  onMoreStories() {
    this.start = this.end
    this.end = this.end + this.pageDisplayCount
    this.newsService.persistTopNewsPage(this.start, this.end)
    // we want to persist start and end so when an user returns to the HN they are where they left off
    this.fetchStories()
    this.hideNextOption = this.stories.length <= this.end
  }
  
  loadMoreSearchResults() {
    this.searchStart = this.searchEnd
    this.searchEnd = this.searchEnd + this.pageDisplayCount
    this.newsService.persistSearchResultsPage(this.searchStart, this.searchEnd)
    this.hideNextOption = this.filteredStories.length <= this.searchEnd
  }

  search(value) {
    this.searching = true;
    this.searchValue = value;
    this.newsService.persistSearchResultsPage(this.searchStart, this.searchEnd)
    this.newsService.persistSearch(value)
    this.applySearchFilter()
    this.hideNextOption = this.filteredStories.length <= this.searchEnd
  }
  applySearchFilter(){
    this.filteredStories = this.stories.filter(s => {
      return s.title.toLowerCase().indexOf(this.searchValue.toLowerCase()) !== -1 || s.by.toLowerCase().indexOf(this.searchValue.toLowerCase()) !== -1
    })
  }
  loadNextPage() {
    if (this.searching) {
      return this.loadMoreSearchResults()
    }
    this.onMoreStories()
  }

  clearSearchResults() {
    this.searching = false;
    this.hideNextOption = false;
    this.resetSearchForm()
  }

  resetSearchForm() {
    let searchForm = document.getElementById('search-form') as any;
    searchForm.reset()
  }
}
