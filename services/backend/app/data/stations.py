import math
from typing import Dict, List, Optional, Tuple
from app.schemas.route import Station, StationType


# 30+ Major Sri Lankan Transit Stations with verified geographic coordinates
STATIONS: Dict[str, Station] = {
    "colombo": Station(
        id="colombo",
        name="Colombo Fort",
        name_si="කොළඹ කොටුව",
        name_ta="கொழும்பு கோட்டை",
        lat=6.9344,
        lng=79.8509,
        station_type=StationType.MULTI_MODAL_HUB,
        province="Western",
        aliases=["colombo", "fort", "pettah", "colombo fort", "කොළඹ", "කොටුව", "கொழும்பு"]
    ),
    "maradana": Station(
        id="maradana",
        name="Maradana",
        name_si="මරදාන",
        name_ta="மருதானை",
        lat=6.9275,
        lng=79.8646,
        station_type=StationType.RAILWAY_STATION,
        province="Western",
        aliases=["maradana", "මරදාන", "மருதானை"]
    ),
    "kandy": Station(
        id="kandy",
        name="Kandy",
        name_si="මහනුවර",
        name_ta="கண்டி",
        lat=7.2906,
        lng=80.6337,
        station_type=StationType.MULTI_MODAL_HUB,
        province="Central",
        aliases=["kandy", "mahanuwara", "good shed", "මහනුවර", "නුවර", "கண்டி"]
    ),
    "galle": Station(
        id="galle",
        name="Galle",
        name_si="ගාල්ල",
        name_ta="காலி",
        lat=6.0367,
        lng=80.2170,
        station_type=StationType.MULTI_MODAL_HUB,
        province="Southern",
        aliases=["galle", "galle fort", "ගාල්ල", "காலி"]
    ),
    "matara": Station(
        id="matara",
        name="Matara",
        name_si="මාතර",
        name_ta="மாத்தறை",
        lat=5.9496,
        lng=80.5353,
        station_type=StationType.MULTI_MODAL_HUB,
        province="Southern",
        aliases=["matara", "මාතර", "மாத்தறை"]
    ),
    "jaffna": Station(
        id="jaffna",
        name="Jaffna",
        name_si="යාපනය",
        name_ta="யாழ்ப்பாணம்",
        lat=9.6615,
        lng=80.0255,
        station_type=StationType.MULTI_MODAL_HUB,
        province="Northern",
        aliases=["jaffna", "yapanaya", "යාපනය", "யாழ்ப்பாணம்"]
    ),
    "badulla": Station(
        id="badulla",
        name="Badulla",
        name_si="බදුල්ල",
        name_ta="பதுளை",
        lat=6.9934,
        lng=81.0550,
        station_type=StationType.MULTI_MODAL_HUB,
        province="Uva",
        aliases=["badulla", "බදුල්ල", "பதுளை"]
    ),
    "anuradhapura": Station(
        id="anuradhapura",
        name="Anuradhapura",
        name_si="අනුරාධපුරය",
        name_ta="அனுராதபுரம்",
        lat=8.3114,
        lng=80.4037,
        station_type=StationType.MULTI_MODAL_HUB,
        province="North Central",
        aliases=["anuradhapura", "අනුරාධපුර", "අනුරාධපුරය", "அனுராதபுரம்"]
    ),
    "trincomalee": Station(
        id="trincomalee",
        name="Trincomalee",
        name_si="ත්‍රිකුණාමලය",
        name_ta="திருகோணமலை",
        lat=8.5874,
        lng=81.2152,
        station_type=StationType.MULTI_MODAL_HUB,
        province="Eastern",
        aliases=["trincomalee", "trinco", "ත්‍රිකුණාමලය", "திருகோணமலை"]
    ),
    "kurunegala": Station(
        id="kurunegala",
        name="Kurunegala",
        name_si="කුරුණෑගල",
        name_ta="குருநாகல்",
        lat=7.4863,
        lng=80.3623,
        station_type=StationType.MULTI_MODAL_HUB,
        province="North Western",
        aliases=["kurunegala", "කුරුණෑගල", "குருநாகல்"]
    ),
    "negombo": Station(
        id="negombo",
        name="Negombo",
        name_si="මීගමුව",
        name_ta="நீர்கொழும்பு",
        lat=7.2008,
        lng=79.8737,
        station_type=StationType.MULTI_MODAL_HUB,
        province="Western",
        aliases=["negombo", "meegamuwa", "මීගමුව", "நீர்கொழும்பு"]
    ),
    "mahiyanganaya": Station(
        id="mahiyanganaya",
        name="Mahiyanganaya",
        name_si="මහියංගනය",
        name_ta="மகிங்கனை",
        lat=7.3278,
        lng=80.9984,
        station_type=StationType.BUS_STAND,
        province="Uva",
        aliases=["mahiyanganaya", "mahiyangana", "මහියංගනය", "මහියංගන", "மகிங்கனை"]
    ),
    "kegalle": Station(
        id="kegalle",
        name="Kegalle",
        name_si="කෑගල්ල",
        name_ta="கேகாலை",
        lat=7.2513,
        lng=80.3464,
        station_type=StationType.BUS_STAND,
        province="Sabaragamuwa",
        aliases=["kegalle", "kegalla", "කෑගල්ල", "கேகாலை"]
    ),
    "monaragala": Station(
        id="monaragala",
        name="Monaragala",
        name_si="මොණරාගල",
        name_ta="மொனராகலை",
        lat=6.8728,
        lng=81.3507,
        station_type=StationType.BUS_STAND,
        province="Uva",
        aliases=["monaragala", "moneragala", "මොණරාගල", "மொனராகலை"]
    ),
    "polonnaruwa": Station(
        id="polonnaruwa",
        name="Polonnaruwa",
        name_si="පොළොන්නරුව",
        name_ta="பொலன்னறுவை",
        lat=7.9403,
        lng=81.0188,
        station_type=StationType.MULTI_MODAL_HUB,
        province="North Central",
        aliases=["polonnaruwa", "kaduruwela", "පොළොන්නරුව", "කදුරුවෙල", "பொலன்னறுவை"]
    ),
    "batticaloa": Station(
        id="batticaloa",
        name="Batticaloa",
        name_si="මඩකලපුව",
        name_ta="மட்டக்களப்பு",
        lat=7.7310,
        lng=81.6747,
        station_type=StationType.MULTI_MODAL_HUB,
        province="Eastern",
        aliases=["batticaloa", "batti", "මඩකලපුව", "மட்டக்களப்பு"]
    ),
    "vavuniya": Station(
        id="vavuniya",
        name="Vavuniya",
        name_si="වවුනියාව",
        name_ta="வவுனியா",
        lat=8.7514,
        lng=80.4971,
        station_type=StationType.MULTI_MODAL_HUB,
        province="Northern",
        aliases=["vavuniya", "වවුනියාව", "வவுனியா"]
    ),
    "nuwara_eliya": Station(
        id="nuwara_eliya",
        name="Nuwara Eliya",
        name_si="නුවරඑළිය",
        name_ta="நுவரெலியா",
        lat=6.9497,
        lng=80.7891,
        station_type=StationType.BUS_STAND,
        province="Central",
        aliases=["nuwara eliya", "nanu oya", "නුවරඑළිය", "නානුඔය", "நுவரெலியா"]
    ),
    "ratnapura": Station(
        id="ratnapura",
        name="Ratnapura",
        name_si="රත්නපුර",
        name_ta="இரத்தினபுரி",
        lat=6.6828,
        lng=80.3992,
        station_type=StationType.BUS_STAND,
        province="Sabaragamuwa",
        aliases=["ratnapura", "rathnapura", "රත්නපුර", "இரத்தினபுரி"]
    ),
    "hambantota": Station(
        id="hambantota",
        name="Hambantota",
        name_si="හම්බන්තොට",
        name_ta="அம்பாந்தோட்டை",
        lat=6.1248,
        lng=81.1185,
        station_type=StationType.BUS_STAND,
        province="Southern",
        aliases=["hambantota", "tangalle", "හම්බන්තොට", "තංගල්ල", "அம்பாந்தோட்டை"]
    ),
    "chilaw": Station(
        id="chilaw",
        name="Chilaw",
        name_si="හලාවත",
        name_ta="சிலாபம்",
        lat=7.5758,
        lng=79.7953,
        station_type=StationType.MULTI_MODAL_HUB,
        province="North Western",
        aliases=["chilaw", "halawatha", "හලාවත", "சிலாபம்"]
    ),
    "puttalam": Station(
        id="puttalam",
        name="Puttalam",
        name_si="පුත්තලම",
        name_ta="புத்தளம்",
        lat=8.0362,
        lng=79.8283,
        station_type=StationType.MULTI_MODAL_HUB,
        province="North Western",
        aliases=["puttalam", "පුත්තලම", "புத்தளம்"]
    ),
    "dambulla": Station(
        id="dambulla",
        name="Dambulla",
        name_si="දඹුල්ල",
        name_ta="தம்புள்ளை",
        lat=7.8601,
        lng=80.6517,
        station_type=StationType.BUS_STAND,
        province="Central",
        aliases=["dambulla", "දඹුල්ල", "தம்புள்ளை"]
    ),
    "ella": Station(
        id="ella",
        name="Ella",
        name_si="ඇල්ල",
        name_ta="எல்ல",
        lat=6.8667,
        lng=81.0466,
        station_type=StationType.RAILWAY_STATION,
        province="Uva",
        aliases=["ella", "ඇල්ල", "எல்ல"]
    ),
    "bandarawela": Station(
        id="bandarawela",
        name="Bandarawela",
        name_si="බණ්ඩාරවෙල",
        name_ta="பண்டாரவளை",
        lat=6.8333,
        lng=80.9833,
        station_type=StationType.MULTI_MODAL_HUB,
        province="Uva",
        aliases=["bandarawela", "බණ්ඩාරවෙල", "பண்டாரவளை"]
    ),
    "haputale": Station(
        id="haputale",
        name="Haputale",
        name_si="හපුතලේ",
        name_ta="அப்புத்தளை",
        lat=6.7686,
        lng=80.9575,
        station_type=StationType.RAILWAY_STATION,
        province="Uva",
        aliases=["haputale", "හපුතලේ", "அப்புத்தளை"]
    ),
    "hatton": Station(
        id="hatton",
        name="Hatton",
        name_si="හැටන්",
        name_ta="ஹற்றன்",
        lat=6.8925,
        lng=80.5975,
        station_type=StationType.MULTI_MODAL_HUB,
        province="Central",
        aliases=["hatton", "හැටන්", "ஹற்றன்"]
    ),
    "avissawella": Station(
        id="avissawella",
        name="Avissawella",
        name_si="අවිස්සාවේල්ල",
        name_ta="அவிசாவளை",
        lat=6.9536,
        lng=80.2114,
        station_type=StationType.BUS_STAND,
        province="Western",
        aliases=["avissawella", "අවිස්සාවේල්ල", "அவிசாவளை"]
    ),
    "katunayake": Station(
        id="katunayake",
        name="Katunayake (Airport)",
        name_si="කටුනායක",
        name_ta="கட்டுநாயக்க",
        lat=7.1706,
        lng=79.8856,
        station_type=StationType.MULTI_MODAL_HUB,
        province="Western",
        aliases=["katunayake", "airport", "bia", "කටුනායක", "கட்டுநாயக்க"]
    ),
    "matale": Station(
        id="matale",
        name="Matale",
        name_si="මාතලේ",
        name_ta="மாத்தளை",
        lat=7.4675,
        lng=80.6234,
        station_type=StationType.MULTI_MODAL_HUB,
        province="Central",
        aliases=["matale", "මාතලේ", "மாத்தளை"]
    ),
}


def get_all_stations() -> List[Station]:
    """Return list of all registered transit stations."""
    return list(STATIONS.values())


def get_station_by_name(query: str) -> Optional[Station]:
    """
    Look up a station by exact ID, English name, Sinhala/Tamil name, or alias.
    Case-insensitive and whitespace-stripped.
    """
    if not query:
        return None
    q = query.strip().lower()
    
    # 1. Exact ID match
    if q in STATIONS:
        return STATIONS[q]
    
    # 2. Check aliases and multilingual names
    for station in STATIONS.values():
        if q == station.name.lower():
            return station
        if q == station.name_si.lower():
            return station
        if q == station.name_ta.lower():
            return station
        for alias in station.aliases:
            if q == alias.lower() or alias.lower() in q or q in alias.lower():
                return station
                
    return None


def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great-circle distance between two geographic coordinates in kilometers.
    Uses the Haversine formula (Earth radius = 6371.0 km).
    """
    r = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return r * c


def get_station_coordinates(station_name: str) -> Optional[Tuple[float, float]]:
    """Returns (latitude, longitude) for a station name if found, else None."""
    station = get_station_by_name(station_name)
    if station:
        return (station.lat, station.lng)
    return None
