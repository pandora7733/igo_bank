"use client";

import { logout } from "../actions/auth";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    // z-50보다 높은 z-[9999] 사용
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-80 text-center border border-gray-100">
        <h2 className="text-xl font-bold mb-2 text-gray-800">로그아웃</h2>
        <p className="text-gray-500 mb-6 text-sm">정말 로그아웃 하시겠습니까?</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition"
          >
            취소
          </button>
          <button
            onClick={() => logout()} // auth.ts의 logout 함수
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-bold"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}