@Injectable({ providedIn: 'root' })
export class ArtistFacade {
  private artistSubject = new BehaviorSubject<Artist[]>([]);
  public artists$ = this.artistSubject.asObservable();

  constructor(private service: ArtistService) {}

  loadArtists(nome?: string, sort: string = 'asc') {
    this.service.getAll(nome, sort).subscribe(data => {
      this.artistSubject.next(data.content);
    });
  }

  // Atualização em tempo real via WebSocket chamaria este método
  updateList(newArtist: Artist) {
    const current = this.artistSubject.value;
    this.artistSubject.next([newArtist, ...current]);
  }
}