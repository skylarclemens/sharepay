import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import blankAvatar from '../../images/Blank_avatar.svg';

const Avatar = ({ url = null, size, classes, type = 'user' }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    if (url) {
      const downloadAvatar = async urlPath => {
        const storageType = type === 'user' ? 'avatars' : 'group-avatars';
        try {
          const { data, error } = await supabase.storage
            .from(storageType)
            .getPublicUrl(urlPath);
          if (error) throw error;
          setAvatarUrl(data.publicUrl);
        } catch (error) {
          console.error(error);
        }
      }
      downloadAvatar(url);
      return;
    }
    setAvatarUrl(null);
  }, [url, type]);

  return (
    <>
      <img
        src={avatarUrl ?? blankAvatar}
        alt={avatarUrl ? 'Avatar' : 'Blank Avatar Icon'}
        className={`avatar ${classes}`}
        style={{
          height: size,
          width: size,
        }} />
    </>
  )
};

export default Avatar;