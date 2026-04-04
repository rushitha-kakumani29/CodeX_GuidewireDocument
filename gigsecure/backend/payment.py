def calculate_premium(amount, credited):
    risk_factor = 1.0

    # 🔹 Dynamic pricing (AI logic simulation)
    if amount > 8000:
        risk_factor = 1.2
    elif amount < 3000:
        risk_factor = 0.8

    if credited:
        return int(amount * 0.10 * risk_factor)
    else:
        return int(amount * 0.05)
def payout(balance, disaster):
    if disaster != "No Risk":
        return balance + 600
    return balance
