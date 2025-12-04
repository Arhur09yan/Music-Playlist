from sqlalchemy.orm import Session
from app.models.playlist import Playlist, PlaylistSong, Like
from app.models.song import Song
from app.schemas.playlist import PlaylistCreate, PlaylistUpdate
from fastapi import HTTPException, status

class PlaylistService:
    @staticmethod
    def create_playlist(db: Session, playlist_create: PlaylistCreate, user_id: int) -> Playlist:
        db_playlist = Playlist(
            name=playlist_create.name,
            description=playlist_create.description,
            owner_id=user_id
        )
        db.add(db_playlist)
        db.commit()
        db.refresh(db_playlist)
        return db_playlist

    @staticmethod
    def get_user_playlists(db: Session, user_id: int, skip: int = 0, limit: int = 20):
        return db.query(Playlist).filter(Playlist.owner_id == user_id).offset(skip).limit(limit).all()

    @staticmethod
    def get_playlist(db: Session, playlist_id: int) -> Playlist:
        playlist = db.query(Playlist).filter(Playlist.id == playlist_id).first()
        if not playlist:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Playlist not found"
            )
        return playlist

    @staticmethod
    def update_playlist(db: Session, playlist_id: int, playlist_update: PlaylistUpdate, user_id: int) -> Playlist:
        playlist = PlaylistService.get_playlist(db, playlist_id)
        
        if playlist.owner_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this playlist"
            )
        
        update_data = playlist_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(playlist, field, value)
        db.commit()
        db.refresh(playlist)
        return playlist

    @staticmethod
    def delete_playlist(db: Session, playlist_id: int, user_id: int):
        playlist = PlaylistService.get_playlist(db, playlist_id)
        
        if playlist.owner_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this playlist"
            )
        
        db.delete(playlist)
        db.commit()
        return {"message": "Playlist deleted successfully"}

    @staticmethod
    def add_song_to_playlist(db: Session, playlist_id: int, song_id: int, user_id: int):
        playlist = PlaylistService.get_playlist(db, playlist_id)
        
        if playlist.owner_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to modify this playlist"
            )
        
        song = db.query(Song).filter(Song.id == song_id).first()
        if not song:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Song not found"
            )
        
        # Check if song already in playlist
        existing = db.query(PlaylistSong).filter(
            (PlaylistSong.playlist_id == playlist_id) & (PlaylistSong.song_id == song_id)
        ).first()
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Song already in playlist"
            )
        
        playlist_song = PlaylistSong(playlist_id=playlist_id, song_id=song_id)
        db.add(playlist_song)
        db.commit()
        db.refresh(playlist)
        return playlist

    @staticmethod
    def remove_song_from_playlist(db: Session, playlist_id: int, song_id: int, user_id: int):
        playlist = PlaylistService.get_playlist(db, playlist_id)
        
        if playlist.owner_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to modify this playlist"
            )
        
        playlist_song = db.query(PlaylistSong).filter(
            (PlaylistSong.playlist_id == playlist_id) & (PlaylistSong.song_id == song_id)
        ).first()
        
        if not playlist_song:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Song not in playlist"
            )
        
        db.delete(playlist_song)
        db.commit()
        return {"message": "Song removed from playlist"}

class LikeService:
    @staticmethod
    def like_song(db: Session, song_id: int, user_id: int):
        song = db.query(Song).filter(Song.id == song_id).first()
        if not song:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Song not found"
            )
        
        existing_like = db.query(Like).filter(
            (Like.user_id == user_id) & (Like.song_id == song_id)
        ).first()
        
        if existing_like:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Song already liked"
            )
        
        like = Like(user_id=user_id, song_id=song_id)
        db.add(like)
        db.commit()
        return {"message": "Song liked"}

    @staticmethod
    def unlike_song(db: Session, song_id: int, user_id: int):
        like = db.query(Like).filter(
            (Like.user_id == user_id) & (Like.song_id == song_id)
        ).first()
        
        if not like:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Like not found"
            )
        
        db.delete(like)
        db.commit()
        return {"message": "Song unliked"}

    @staticmethod
    def get_user_likes(db: Session, user_id: int, skip: int = 0, limit: int = 20):
        likes = db.query(Like).filter(Like.user_id == user_id).offset(skip).limit(limit).all()
        songs = [like.song for like in likes]
        return songs
