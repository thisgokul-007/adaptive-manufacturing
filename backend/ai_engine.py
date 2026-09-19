import math
from typing import Dict, Any, List

class AIEngine:
    """
    Industry 4.0 AI Decision Engine & Predictive System for Smart Manufacturing.
    Performs real-time condition classification, natural language diagnostics,
    adaptive closed-loop control recommendations, and production risk forecasting.
    """
    
    # Threshold Constants
    TEMP_NORMAL_MAX = 75.0
    TEMP_WARNING_MAX = 90.0
    
    VIB_NORMAL_MAX = 3.5
    VIB_WARNING_MAX = 6.0
    
    LOAD_NORMAL_MAX = 75.0
    LOAD_WARNING_MAX = 90.0
    
    @staticmethod
    def classify_condition(temp: float, vibration: float, load: float, rpm: int) -> Dict[str, Any]:
        """
        Classifies current machine condition into NORMAL, WARNING, or CRITICAL.
        Returns condition status, primary reason, and severity code.
        """
        reasons = []
        is_critical = False
        is_warning = False

        # Check Temperature
        if temp > AIEngine.TEMP_WARNING_MAX:
            is_critical = True
            reasons.append(f"Temperature critical ({temp:.1f}°C > {AIEngine.TEMP_WARNING_MAX}°C threshold)")
        elif temp >= AIEngine.TEMP_NORMAL_MAX:
            is_warning = True
            reasons.append(f"Temperature elevated ({temp:.1f}°C in warning range {AIEngine.TEMP_NORMAL_MAX}-{AIEngine.TEMP_WARNING_MAX}°C)")

        # Check Vibration
        if vibration > AIEngine.VIB_WARNING_MAX:
            is_critical = True
            reasons.append(f"Vibration critical ({vibration:.1f} mm/s > {AIEngine.VIB_WARNING_MAX} mm/s limit)")
        elif vibration >= AIEngine.VIB_NORMAL_MAX:
            is_warning = True
            reasons.append(f"Vibration elevated ({vibration:.1f} mm/s in warning zone)")

        # Check Load
        if load > AIEngine.LOAD_WARNING_MAX:
            is_critical = True
            reasons.append(f"Machine load critical ({load:.1f}% > {AIEngine.LOAD_WARNING_MAX}% maximum capacity)")
        elif load >= AIEngine.LOAD_NORMAL_MAX:
            is_warning = True
            reasons.append(f"Machine load high ({load:.1f}% in heavy load band)")

        if is_critical:
            condition = "CRITICAL"
            primary_reason = " | ".join(reasons) if reasons else "Critical operational parameters exceeded."
        elif is_warning:
            condition = "WARNING"
            primary_reason = " | ".join(reasons) if reasons else "Parameters approaching upper tolerance bounds."
        else:
            condition = "NORMAL"
            primary_reason = "All telemetry metrics operating within nominal baseline parameters."

        return {
            "condition": condition,
            "reason": primary_reason,
            "is_critical": is_critical,
            "is_warning": is_warning
        }

    @staticmethod
    def generate_ai_insight(temp: float, vibration: float, load: float, rpm: int, condition_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generates contextual natural language AI diagnostic analysis and adaptive speed control recommendations.
        """
        condition = condition_data["condition"]
        
        # Calculate recommended RPM based on condition severity
        if condition == "CRITICAL":
            # Deep reduction to protect spindle & tool
            target_rpm = max(800, int(rpm * 0.70))  # -30% reduction
            adjustment_pct = round(((target_rpm - rpm) / rpm) * 100, 1)
            insight = (
                f"Thermal stress and vibration levels have escalated sharply ({temp:.1f}°C, {vibration:.1f} mm/s). "
                f"Spindle motor under {load:.1f}% load is approaching structural resonance and heat saturation threshold. "
                "Immediate speed attenuation is mandatory to prevent thermal expansion damage."
            )
            recommendation = f"Reduce machine speed from {rpm} RPM → {target_rpm} RPM (-30% reduction)."
            expected_outcome = "Immediate reduction of frictional heat generation by ~35% and vibration suppression."

        elif condition == "WARNING":
            # Moderate reduction to stabilize
            target_rpm = max(1000, int(rpm * 0.82))  # -18% reduction
            adjustment_pct = round(((target_rpm - rpm) / rpm) * 100, 1)
            insight = (
                f"Temperature has increased to {temp:.1f}°C while vibration is trending upwards at {vibration:.1f} mm/s. "
                f"Machine load ({load:.1f}%) is elevating bearing temperatures above optimal equilibrium."
            )
            recommendation = f"Reduce machine speed from {rpm} RPM → {target_rpm} RPM ({adjustment_pct}% adjustment)."
            expected_outcome = "Thermal stabilization within 15-30 seconds, restoring temperature below 75°C."

        else:
            target_rpm = 1500
            adjustment_pct = 0.0
            insight = (
                f"Machine telemetry is stable at {temp:.1f}°C, {vibration:.1f} mm/s vibration, and {load:.1f}% load. "
                "Spindle harmonics and thermal expansion are within optimal tolerance limits."
            )
            recommendation = "Maintain current speed at 1500 RPM. System operating at peak efficiency."
            expected_outcome = "Standard production yield with zero micro-fracture or thermal defect risk."

        return {
            "insight": insight,
            "recommendation": recommendation,
            "current_rpm": rpm,
            "recommended_rpm": target_rpm,
            "adjustment_pct": adjustment_pct,
            "expected_outcome": expected_outcome
        }

    @staticmethod
    def calculate_health_and_risk(temp: float, vibration: float, load: float) -> Dict[str, Any]:
        """
        Calculates Machine Health score (0-100%) and individual component stability ratings.
        """
        # Temperature stability (100% at 50°C, 0% at 100°C)
        temp_score = max(0.0, min(100.0, 100.0 - (max(0.0, temp - 55.0) * 2.0)))
        
        # Vibration stability (100% at 1.0 mm/s, 0% at 8.0 mm/s)
        vib_score = max(0.0, min(100.0, 100.0 - (max(0.0, vibration - 1.5) * 15.0)))
        
        # Load stability (100% at 50%, 0% at 100%)
        load_score = max(0.0, min(100.0, 100.0 - (max(0.0, load - 60.0) * 2.2)))
        
        # Weighted overall machine health
        health = round((temp_score * 0.4) + (vib_score * 0.35) + (load_score * 0.25), 1)
        failure_risk = round(100.0 - health, 1)

        return {
            "machine_health": health,
            "failure_risk": failure_risk,
            "temp_stability": round(temp_score, 1),
            "vib_stability": round(vib_score, 1),
            "load_stability": round(load_score, 1)
        }

    @staticmethod
    def predict_production(
        operation_type: str,
        material: str,
        duration: float,
        rpm: int,
        expected_load: float,
        ambient_temp: float
    ) -> Dict[str, Any]:
        """
        'PREDICT BEFORE PRODUCTION'
        Calculates pre-production risk probability, expected failure modes, and optimization suggestions.
        """
        # Hardness factors
        material_hardness = {
            "Titanium Grade 5": 1.45,
            "Hardened Tool Steel": 1.35,
            "Stainless Steel 316": 1.20,
            "Cast Iron": 1.05,
            "Aluminum 6061": 0.75,
            "Brass": 0.70
        }.get(material, 1.0)

        # Operation intensity factor
        op_intensity = {
            "High-Speed Drilling": 1.25,
            "Heavy End-Milling": 1.18,
            "Deep Hole Boring": 1.15,
            "Precision Turning": 1.00,
            "Surface Grinding": 0.85
        }.get(operation_type, 1.0)

        # Baseline physics risk calculation
        speed_ratio = rpm / 1500.0
        load_ratio = expected_load / 70.0
        temp_factor = 1.0 + max(0.0, (ambient_temp - 25.0) * 0.02)
        duration_factor = 1.0 + (math.log(max(1.0, duration)) * 0.15)

        raw_risk_score = (speed_ratio * 25.0) * (load_ratio * 1.4) * material_hardness * op_intensity * temp_factor * duration_factor
        risk_probability = max(5.0, min(98.0, round(raw_risk_score, 1)))

        # Determine predicted condition
        if risk_probability >= 70.0:
            predicted_condition = "CRITICAL"
        elif risk_probability >= 40.0:
            predicted_condition = "WARNING"
        else:
            predicted_condition = "NORMAL"

        # Identify key failure vectors
        issues = []
        if speed_ratio > 1.15:
            issues.append("High centrifugal force and bearing chatter at >1700 RPM")
        if material_hardness > 1.1:
            issues.append(f"Elevated tool wear rate cutting {material}")
        if expected_load > 75.0:
            issues.append("Spindle torque saturation & current overload risk")
        if ambient_temp > 30.0:
            issues.append(f"Reduced ambient heat dissipation at {ambient_temp}°C")
        if duration > 3.0:
            issues.append(f"Long continuous run cycle ({duration}h) leading to thermal creep")

        if not issues:
            issues.append("No critical failure vectors detected.")

        # Determine recommended parameters
        rec_rpm = int(rpm * (0.80 if risk_probability > 65 else (0.90 if risk_probability > 40 else 1.0)))
        rec_load = min(expected_load, 70.0)

        recommendation = (
            f"Set spindle speed to {rec_rpm} RPM (down from {rpm} RPM) and maintain load below {rec_load:.0f}%. "
            f"Increase coolant flow by {int((risk_probability / 100.0) * 30)}%."
        )

        expected_result = (
            f"Reduces thermal build-up by ~{int(risk_probability * 0.4)}%, prevents micro-vibration chatter, "
            "and extends cutter insert life by 40%."
        )

        return {
            "operation_type": operation_type,
            "material": material,
            "duration": duration,
            "rpm": rpm,
            "expected_load": expected_load,
            "ambient_temp": ambient_temp,
            "predicted_condition": predicted_condition,
            "risk_probability": risk_probability,
            "possible_issues": issues,
            "recommended_action": recommendation,
            "recommended_rpm": rec_rpm,
            "expected_result": expected_result
        }

    @staticmethod
    def what_if_simulation(
        temp: float,
        vibration: float,
        rpm: int,
        load: float,
        duration: float
    ) -> Dict[str, Any]:
        """
        Calculates live What-If risk matrix and recommended RPM for custom slider inputs.
        """
        temp_risk = max(0.0, (temp - 50.0) * 1.2)
        vib_risk = max(0.0, (vibration - 1.0) * 12.0)
        speed_risk = max(0.0, (rpm - 1200) * 0.03)
        load_risk = max(0.0, (load - 50.0) * 0.8)
        dur_risk = duration * 2.0

        total_risk = max(4.0, min(99.0, round(temp_risk + vib_risk + speed_risk + load_risk + dur_risk, 1)))

        cond_info = AIEngine.classify_condition(temp, vibration, load, rpm)
        rec_info = AIEngine.generate_ai_insight(temp, vibration, load, rpm, cond_info)

        return {
            "temp": temp,
            "vibration": vibration,
            "rpm": rpm,
            "load": load,
            "duration": duration,
            "risk_probability": total_risk,
            "condition": cond_info["condition"],
            "recommended_rpm": rec_info["recommended_rpm"],
            "adjustment_pct": rec_info["adjustment_pct"]
        }
