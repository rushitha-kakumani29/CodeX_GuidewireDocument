def detect_disaster(temp, aqi, rain):
    if temp > 45:
        return "Heatwave"
    if aqi > 300:
        return "Pollution"
    if rain > 70:
        return "Flood"
    return "No Risk"
