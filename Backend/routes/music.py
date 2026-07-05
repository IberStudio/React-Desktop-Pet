import requests
import time
from flask import Blueprint, Response, request, jsonify, stream_with_context
from extensions import ytdlp, db
from models.music_models import Music, get_result, get_related, get_info

stream_bp = Blueprint('stream', __name__, url_prefix='/api/stream')


def get_audio_info(video_id: str) -> dict:
    """Extract audio URL and metadata from a video ID."""
    with ytdlp.YoutubeDL({'format': 'bestaudio', 'quiet': True}) as ydl:
        info = ydl.extract_info(
            f"https://youtube.com/watch?v={video_id}",
            download=False
        )
        return {
            'url': info['url'],
            'ext': info.get('ext', 'webm'),
            'title': info.get('title'),
            'duration': info.get('duration'),
            'thumbnail': info.get('thumbnail'),
        }

@stream_bp.route('/search', methods=["PUT"])
def get_music_id():
    data = request.get_json()
    title = data['title']

    if not title:
        return jsonify({"error": "title query parameter is required"}), 400

    return jsonify(get_result(title))


@stream_bp.put('/related')
def video_info():
    data = request.get_json()
    video_id = data['videoId']
    
    if not video_id:
        return jsonify({"error": "videoId query parameter is required"}), 400

    return jsonify(get_related(video_id))

@stream_bp.route('/info', methods=['GET', 'PUT'])
def get_music_info():
    data = request.get_json()
    id = data['id']

    if not id:
        return jsonify({"error": "id query parameter is required"}), 400

    return jsonify(get_info(id))


@stream_bp.route('/play/<video_id>', methods=['GET'])
def stream_audio(video_id: str):
    print(f"Received video_id: {video_id}")

    try:
        info = get_audio_info(video_id)
        print(f"Extracted URL: {info['url'][:80]}...")  # sanity check it's not empty/malformed
    except Exception as e:
        print(f"Extraction failed: {e}")
        return jsonify({'error': str(e)}), 400

    range_header = request.headers.get('Range', None)
    yt_headers = {'User-Agent': 'Mozilla/5.0'}
    if range_header:
        yt_headers['Range'] = range_header

    try:
        start = time.time()
        yt_response = requests.get(
            info['url'],
            stream=True,
            headers=yt_headers,
            timeout=10  # fail fast instead of hanging forever
        )
        print(f"Upstream connected in {time.time() - start:.2f}s, status: {yt_response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Upstream request failed: {e}")
        return jsonify({'error': f'Failed to fetch stream: {str(e)}'}), 502

    response_headers = {
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': f"audio/{info['ext']}",
    }
    if 'Content-Range' in yt_response.headers:
        response_headers['Content-Range'] = yt_response.headers['Content-Range']
    if 'Content-Length' in yt_response.headers:
        response_headers['Content-Length'] = yt_response.headers['Content-Length']

    return Response(
        stream_with_context(yt_response.iter_content(chunk_size=4096)),
        status=yt_response.status_code,
        headers=response_headers
    )

@stream_bp.get('/last/')
def get_last():
    music = Music.query.get(1)
    if not music:
        return jsonify({"videoId": None}), 404
    return jsonify(music.to_dict())

@stream_bp.put('/last/<int:id>')
def save_last_video(id):
    data = request.get_json()
    video_id = data.get('videoId')
    
    music = Music.query.get(1)
    if not music:
        music = Music(id=id, video_id=video_id)
        db.session.add(music)
    else:
        music.video_id = video_id
    
    db.session.commit()
    return jsonify(music.to_dict())