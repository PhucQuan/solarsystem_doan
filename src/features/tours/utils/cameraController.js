import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';

/**
 * Camera Controller - Quản lý animations của camera bằng Tween.js
 * Sử dụng cho Tour Guide System
 */
class CameraController {
    constructor() {
        this.activeTweens = [];
        this.isAnimating = false;
        // Create dedicated Group for camera tweens
        this.tweenGroup = new TWEEN.Group();
    }

    /**
     * Update tweens - call this in animation loop
     */
    update(time) {
        this.tweenGroup.update(time);
    }

    /**
     * Animate để update tween trong animation loop
     * Gọi hàm này trong render loop của Three.js
     */
    update() {
        TWEEN.update();
    }

    /**
     * Fly camera đến vị trí mới với smooth animation
     * @param {THREE.Camera} camera - Three.js camera object
     * @param {Object} targetPosition - {x, y, z} vị trí đích
     * @param {Object} targetLookAt - {x, y, z} điểm camera nhìn vào
     * @param {number} duration - Thời gian animation (ms)
     * @param {Function} onComplete - Callback khi hoàn thành
     * @param {Function} onUpdate - Callback mỗi frame update
     */
    flyTo(camera, targetPosition, targetLookAt, duration = 3000, onComplete = null, onUpdate = null) {
        console.log('🎬 CameraController.flyTo called', { targetPosition, targetLookAt, duration });

        // Stop tất cả animations hiện tại
        this.stopAllAnimations();
        this.isAnimating = true;

        // Lưu vị trí và rotation hiện tại
        const startPosition = {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z
        };

        // Tween cho camera position - use custom Group
        const positionTween = new TWEEN.Tween(startPosition, this.tweenGroup)
            .to(targetPosition, duration)
            .easing(TWEEN.Easing.Cubic.InOut) // Smooth easing
            .onUpdate(() => {
                // startPosition is being tweened by TWEEN, so we read its current values
                camera.position.set(startPosition.x, startPosition.y, startPosition.z);

                // Debug: Log every 30 frames
                if (!this._updateCount) this._updateCount = 0;
                this._updateCount++;
                if (this._updateCount % 30 === 0) {
                    console.log('🔄 TWEEN updating camera:', { x: startPosition.x.toFixed(2), y: startPosition.y.toFixed(2), z: startPosition.z.toFixed(2) });
                }

                // Luôn nhìn vào target point
                if (targetLookAt) {
                    camera.lookAt(targetLookAt.x, targetLookAt.y, targetLookAt.z);
                }

                if (onUpdate) {
                    onUpdate();
                }
            })
            .onComplete(() => {
                this.isAnimating = false;
                console.log('✅ Camera animation completed');
                if (onComplete) {
                    onComplete();
                }
            })
            .start();

        this.activeTweens.push(positionTween);
        console.log('📝 Tween started in Group, active tweens:', this.tweenGroup.getAll().length);

        return positionTween;
    }

    /**
     * Rotate camera quanh một điểm (cho effect xoay quanh hành tinh)
     * @param {THREE.Camera} camera 
     * @param {Object} center - Điểm trung tâm {x, y, z}
     * @param {number} radius - Bán kính quỹ đạo
     * @param {number} speed - Tốc độ quay (độ/giây)
     * @param {number} duration - Thời gian quay (ms), null = vô hạn
     */
    rotateAround(camera, center, radius, speed = 30, duration = null) {
        const startAngle = Math.atan2(
            camera.position.z - center.z,
            camera.position.x - center.x
        );

        const rotationData = { angle: startAngle };
        const targetAngle = duration
            ? startAngle + (speed * duration / 1000) * (Math.PI / 180)
            : startAngle + Math.PI * 2; // Full circle

        const rotationTween = new TWEEN.Tween(rotationData, this.tweenGroup)
            .to({ angle: targetAngle }, duration || 10000)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(() => {
                const x = center.x + radius * Math.cos(rotationData.angle);
                const z = center.z + radius * Math.sin(rotationData.angle);

                camera.position.set(x, camera.position.y, z);
                camera.lookAt(center.x, center.y, center.z);
            })
            .start();

        this.activeTweens.push(rotationTween);
        return rotationTween;
    }

    /**
     * Pause tất cả animations
     */
    pauseAllAnimations() {
        this.activeTweens.forEach(tween => {
            if (tween.pause) tween.pause();
        });
    }

    /**
     * Resume animations đã pause
     */
    resumeAllAnimations() {
        this.activeTweens.forEach(tween => {
            if (tween.resume) tween.resume();
        });
    }

    /**
     * Stop tất cả animations
     */
    stopAllAnimations() {
        console.log('🛑 Stopping', this.activeTweens.length, 'tweens');
        this.activeTweens.forEach(tween => {
            if (tween.stop) tween.stop();
        });
        this.activeTweens = [];
        this.isAnimating = false;
    }

    /**
     * Cinematic camera movement - kết hợp fly + rotation
     * Tạo effect điện ảnh khi tiếp cận hành tinh
     */
    cinematicApproach(camera, targetPlanet, finalPosition, finalLookAt, duration = 5000, onComplete = null) {
        this.stopAllAnimations();
        this.isAnimating = true;

        // Phase 1: Fly đến vị trí gần hành tinh (80% thời gian)
        const approachDuration = duration * 0.8;
        const rotateDuration = duration * 0.2;

        // Vị trí trung gian (gần hơn một chút)
        const intermediatePos = {
            x: finalPosition.x * 1.3,
            y: finalPosition.y * 1.3,
            z: finalPosition.z * 1.3
        };

        const approachTween = this.flyTo(
            camera,
            intermediatePos,
            finalLookAt,
            approachDuration,
            () => {
                // Phase 2: Rotate một chút quanh hành tinh (cinematic effect)
                const radius = Math.sqrt(
                    Math.pow(finalPosition.x, 2) +
                    Math.pow(finalPosition.y, 2) +
                    Math.pow(finalPosition.z, 2)
                );

                // Rotate 45 độ
                this.rotateAround(camera, finalLookAt, radius, 45, rotateDuration);

                // Sau đó settle vào vị trí cuối
                setTimeout(() => {
                    this.flyTo(camera, finalPosition, finalLookAt, 1000, () => {
                        this.isAnimating = false;
                        if (onComplete) onComplete();
                    });
                }, rotateDuration);
            }
        );

        return approachTween;
    }

    /**
     * Check xem đang có animation nào chạy không
     */
    getIsAnimating() {
        return this.isAnimating;
    }
}

// Export singleton instance
export default new CameraController();
