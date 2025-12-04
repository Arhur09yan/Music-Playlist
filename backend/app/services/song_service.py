from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.song import Song
from app.schemas.song import SongCreate, SongUpdate
from fastapi import HTTPException, status

class SongService:
    @staticmethod
    def create_song(db: Session, song_create: SongCreate) -> Song:
        db_song = Song(**song_create.model_dump())
        db.add(db_song)
        db.commit()
        db.refresh(db_song)
        return db_song

    @staticmethod
    def get_all_songs(db: Session, skip: int = 0, limit: int = 20):
        return db.query(Song).offset(skip).limit(limit).all()

    @staticmethod
    def get_song(db: Session, song_id: int) -> Song:
        song = db.query(Song).filter(Song.id == song_id).first()
        if not song:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Song not found"
            )
        return song

    @staticmethod
    def update_song(db: Session, song_id: int, song_update: SongUpdate) -> Song:
        song = SongService.get_song(db, song_id)
        update_data = song_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(song, field, value)
        db.commit()
        db.refresh(song)
        return song

    @staticmethod
    def delete_song(db: Session, song_id: int):
        song = SongService.get_song(db, song_id)
        db.delete(song)
        db.commit()
        return {"message": "Song deleted successfully"}

    @staticmethod
    def search_songs(db: Session, q: str, skip: int = 0, limit: int = 20):
        query = db.query(Song).filter(
            or_(
                Song.title.ilike(f"%{q}%"),
                Song.artist.ilike(f"%{q}%"),
                Song.album.ilike(f"%{q}%"),
                Song.genre.ilike(f"%{q}%")
            )
        )
        return query.offset(skip).limit(limit).all()

    @staticmethod
    def get_song_count(db: Session):
        return db.query(Song).count()
