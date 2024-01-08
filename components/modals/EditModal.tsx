import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { CldUploadButton } from "next-cloudinary";
import useCurrentUser from "@/hooks/useCurrentUser";
import useEditModal from "@/hooks/useEditModal";
import useUser from "@/hooks/useUser";

import Input from "../Input";
import Modal from "../Modal";
import Image from "next/image";

const EditModal = () => {
  const { data: currentUser } = useCurrentUser();
  const { mutate: mutateFetchedUser } = useUser(currentUser?.id);
  const editModal = useEditModal();

  const [profileImage, setProfileImage] = useState(currentUser?.profileImage);
  const [coverImage, setCoverImage] = useState(currentUser?.coverImage);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    // setProfileImage(currentUser?.profileImage);
    // setCoverImage(currentUser?.coverImage);
    setName(currentUser?.name);
    setUsername(currentUser?.username);
    setBio(currentUser?.bio);
  }, [
    currentUser?.name,
    currentUser?.username,
    currentUser?.bio,
    currentUser?.profileImage,
    currentUser?.coverImage,
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      await axios.patch("/api/edit", {
        name,
        username,
        bio,
        profileImage,
        coverImage,
      });
      mutateFetchedUser();

      toast.success("Updated");

      editModal.onClose();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [
    editModal,
    name,
    username,
    bio,
    mutateFetchedUser,
    profileImage,
    coverImage,
  ]);

  const handleProfilePic = (result: any) => {
    setProfileImage(result?.info?.secure_url);
    console.log(result?.info?.secure_url + "profile pic");
  };
  const handleCoverPic = (result: any) => {
    setCoverImage(result?.info?.secure_url);
    console.log(result?.info?.secure_url + "Cover pic");
  };

  const bodyContent = (
    <div className="flex flex-col gap-4 h-fit">
      <CldUploadButton
        options={{ maxFiles: 1 }}
        uploadPreset="twitter"
        onUpload={handleProfilePic}
      >
        <p className="border-[1px] border-neutral-600 h-[50px] flex items-center justify-center font-semibold">
          Upload Profile Picture
        </p>
      </CldUploadButton>

      <CldUploadButton
        options={{ maxFiles: 1 }}
        uploadPreset="twitter"
        onUpload={handleCoverPic}
      >
        <p className="border-[1px] border-neutral-600 h-[50px] flex items-center justify-center font-semibold">
          Upload Cover Picture
        </p>
      </CldUploadButton>
      <Input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
        value={name}
        disabled={isLoading}
      />
      <Input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        disabled={isLoading}
      />
      <Input
        placeholder="Bio"
        onChange={(e) => setBio(e.target.value)}
        value={bio}
        disabled={isLoading}
      />
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={editModal.isOpen}
      title="Edit your profile"
      actionLabel="Save"
      onClose={editModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  );
};

export default EditModal;
