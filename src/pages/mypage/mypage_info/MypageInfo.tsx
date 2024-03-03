import { ChangeEvent, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { MypageHeader } from "../mypage_header/MypageHeader";
import "./MypageInfo.css";
import axiosClient from "../../../utils/axiosClient";
import { setUserInfo } from "../../../store/userInfo";
import axios from "axios";

enum EditingFlag {
  Idle,
  Nickname,
  ProfileImage,
}

export function MypageInfo() {
  const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
  const nicknamePattern = /^[가-힣a-zA-Z0-9]{1,10}$/;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const userInfo = useAppSelector((state) => state.userInfo);
  const dispatch = useAppDispatch();

  const [editFlag, setEditFlag] = useState<EditingFlag>(EditingFlag.Idle);
  const [edNickname, setEdNickname] = useState(userInfo.nickname);

  const [edFile, setEdFile] = useState<File | null>(null);

  const [profilePreview, setProfilePreview] = useState(userInfo.photo_url);

  async function submitNickname() {
    if (!nicknamePattern.test(edNickname)) {
      alert("닉네임은 특수문자를 제외하여 10자 이내로 입력해 주세요.");
      return;
    }
    try {
      await axiosClient.put("/user/nickname", { nickname: edNickname });
      setEditFlag(EditingFlag.Idle);
      dispatch(setUserInfo({ ...userInfo, nickname: edNickname }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errRes = error.response?.data;
        if (errRes.includes("already exist")) {
          alert("이미 존재하는 닉네임입니다. 다른 닉네임을 입력해주세요.");
        }
      }
    }
  }

  async function submitProfileImg() {
    const fd = new FormData();
    if (edFile) {
      fd.append("image", edFile);
    }

    try {
      const res = await axiosClient.put("/user/profile", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(setUserInfo({ ...userInfo, photo_url: res.data }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errRes = error.response?.data;
        if (errRes.includes("24 hours")) {
          alert("프로필 이미지 업로드는 하루에 한 번만 가능합니다.");
        }
      }
      setProfilePreview(userInfo.photo_url);
    }
    setEditFlag(EditingFlag.Idle);
  }

  const changeProfileImg = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const selected = files[0];
      // 파일 선택에 대한 로직 추가
      const fileExtension = selected.name.split(".").pop()?.toLowerCase();
      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        alert(
          "이미지 파일 확장자가 잘못되었습니다. JPG, JPEG, PNG, GIF 중에서 업로드 해주세요."
        );
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (selected.size > maxSize) {
        alert("이미지 파일은 5 MB 이내로 업로드 해주세요.");
        return;
      }

      setEdFile(selected);
      setProfilePreview(URL.createObjectURL(selected));
      setEditFlag(EditingFlag.ProfileImage);
    }
  };

  return (
    <div className="mypage_info">
      <MypageHeader title="회원정보" backLink="mypage" />
      <div className="mypage_info_profile_image">
        <img
          src={profilePreview}
          alt="profile"
          onClick={() => {
            fileInputRef.current?.click();
          }}
        />
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={changeProfileImg}
        ></input>
      </div>
      {editFlag === EditingFlag.Nickname ? (
        <div
          className="mypage_info_nickname"
          style={{ borderBottom: "1px solid #e7e7e7" }}
        >
          <input
            type="text"
            value={edNickname}
            onChange={(e) => {
              setEdNickname(e.target.value);
            }}
          />
          <img
            className="mypage_info_nickname_cancel"
            src="/images/close.png"
            alt="cancel"
            onClick={() => {
              setEditFlag(EditingFlag.Idle);
            }}
          />
        </div>
      ) : (
        <div className="mypage_info_nickname">
          {userInfo.nickname}
          <img
            className="mypage_info_edit"
            src="/images/edit.png"
            alt="edit"
            onClick={() => {
              setEditFlag(EditingFlag.Nickname);
            }}
          />
        </div>
      )}
      {editFlag !== EditingFlag.Idle ? (
        <div
          className="mypage_info_nickname_save"
          onClick={
            editFlag === EditingFlag.Nickname
              ? submitNickname
              : submitProfileImg
          }
        >
          저장
        </div>
      ) : null}
    </div>
  );
}
