import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import { useTranslation } from 'next-i18next'

export default function AccountBtn({ session, openAccountModal, navbarMode }) {
  const { t: text } = useTranslation("common");

  return (
    <>
    {!session || !session?.token?.secret ? (
        <button className={`gameBtn ${navbarMode ? 'navBtn' : 'accountBtn'}`} onClick={() => session === null && signIn('google')}>

        { !session?.token?.secret && session !== null ? '...' :
        (
          <>
          {text("login")}
        <FaGoogle className="home__squarebtnicon" />
          </>
        )}
        </button>
    ) : (
        <button className={`gameBtn ${navbarMode ? 'navBtn' : 'accountBtn'}`} onClick={() => openAccountModal()}>
          {session?.token?.username ? <p style={{ color: 'white', marginRight: '10px' }}>{session?.token?.username}</p> : null}
        </button>
    )}
    </>
  )
}