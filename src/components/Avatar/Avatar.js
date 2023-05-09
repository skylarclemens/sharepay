import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import blankAvatar from '../../images/Blank_avatar.svg';

const Avatar = ({ url, size, classes, type = 'account' }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    const downloadAvatar = async urlPath => {
      const storageType = type === 'account' ? 'avatars' : 'group-avatars';
      try {
        const { data, error } = await supabase.storage
          .from(storageType)
          .getPublicUrl(urlPath);
        if (error) throw error;
        setAvatarUrl(data.publicUrl);
      } catch (error) {
        console.error(error);
      }
    };

    if (url) {
      downloadAvatar(url);
    } else {
      setAvatarUrl(null);
    }
  }, [url, type]);

  return (
    <>
      <img
        src={avatarUrl ?? blankAvatar}
        alt={avatarUrl ? 'Blank Avatar Icon' : 'User Avatar'}
        className={`avatar ${classes}`}
        style={{
          height: size,
          width: size,
        }}
      />
    </>
  );
};

export default Avatar;
