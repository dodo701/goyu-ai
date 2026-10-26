# scripts/check_environment.py
import sys
import torch

def check_env():
    print("=== GOYU-미니 1.0 환경 확인 ===")
    print(f"Python 버전: {sys.version}")
    print(f"PyTorch 버전: {torch.__version__}")
    
    cuda_available = torch.cuda.is_available()
    print(f"CUDA 사용 가능 여부: {cuda_available}")
    
    if cuda_available:
        print(f"GPU 장치명: {torch.cuda.get_device_name(0)}")
        print(f"사용 가능한 GPU 개수: {torch.cuda.device_count()}")
    else:
        print("GPU가 감지되지 않았습니다. 초기 학습 및 테스트는 CPU 환경에서 진행됩니다.")

if __name__ == "__main__":
    check_env()