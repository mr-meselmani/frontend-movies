import { ComponentFixture, TestBed } from "@angular/core/testing"
import { MoviesComponent } from "./movies.component"
import { MoviesService } from "./movies.service"
import { HttpClientTestingModule } from "@angular/common/http/testing"
import { ReactiveFormsModule } from "@angular/forms"
import { of } from "rxjs"

describe("MoviesComponent (Integration Tests)", () => {
  let component: MoviesComponent
  let fixture: ComponentFixture<MoviesComponent>
  let moviesService: MoviesService

  const mockMovie = {
    Title: "Test Movie",
    Year: "2024",
    imdbID: "tt1234567",
    Plot: "Test plot",
    Poster: "test.jpg",
    Director: "Test Director",
    Actors: "Test Actor",
    Runtime: "120 min",
    Rated: "PG-13",
    Genre: "Action",
    Released: "01 Jan 2024",
    Writer: "Test Writer",
    Language: "English",
    imdbRating: "8.0",
    BoxOffice: "$100M",
    Ratings: [{ Source: "IMDB", Value: "8.0/10" }],
  }

  const mockReviews = [
    {
      id: "1",
      movieId: "tt1234567",
      reviewText: "Great movie!",
      username: "testuser",
      createdAt: {
        _seconds: 1234567890,
        _nanoseconds: 0,
      },
    },
  ]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, MoviesComponent],
      providers: [MoviesService],
    }).compileComponents()

    fixture = TestBed.createComponent(MoviesComponent)
    component = fixture.componentInstance
    moviesService = TestBed.inject(MoviesService)
    fixture.detectChanges()
  })

  it("should search and render movie and reviews", () => {
    jest
      .spyOn(moviesService, "searchMovies")
      .mockReturnValue(
        of({
          message: "success",
          data: { movie: mockMovie, reviews: mockReviews },
        })
      )

    component.searchQuery = "Test Movie"
    component.search()
    fixture.detectChanges()

    const compiled = fixture.nativeElement as HTMLElement
    expect(compiled.textContent).toContain("Test Movie")
    expect(compiled.textContent).toContain("Great movie!")
  })
})
