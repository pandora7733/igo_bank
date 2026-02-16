"use client";

import { logout } from "../actions/auth";

interface logoutModalPrps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutModal({ isOpen, onClose }: logoutModalPrps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-80 text-center">
        <h2 className="text-xl font-bold mb-4">로그아웃 하시겠습니까?</h2>
        <div className="flex justify-center gap-3">
          {/* 취소 버튼 */}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            취소
          </button>
          {/* 로그아웃 실행 버튼 */}
          <button
            onClick={() => logout()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}