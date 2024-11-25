import { DeleteAccountModal } from '@/components/modals/DeleteAccountModal'
import { UpdateAccountAvatarModal } from '@/components/modals/UpdateAccountAvatarModal'
import { UpdateAccountBannerModel } from '@/components/modals/UpdateAccountBannerModal'
import { UpdateAccountDescriptionModal } from '@/components/modals/UpdateAccountDescriptionModal'
import { UpdateAccountDisplayNameModal } from '@/components/modals/UpdateAccountDisplayNameModal'
import { UpdateAccountEmailModal } from '@/components/modals/UpdateAccountEmailModal'
import { UpdateAccountPasswordModal } from '@/components/modals/UpdateAccountPasswordModal'

export default function SettingsPage() {
  return (
    <div className='mx-auto w-full max-w-6xl p-6'>
      <main>
        <h1 className='mb-8 scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl'>
          Settings
        </h1>
        <div className='flex flex-col items-start gap-4'>
          <h2 className='mt-2 scroll-m-20 text-2xl font-semibold tracking-tight'>Account</h2>
          <UpdateAccountEmailModal />
          <UpdateAccountPasswordModal />
          <h2 className='mt-2 scroll-m-20 text-2xl font-semibold tracking-tight'>Profile</h2>
          <UpdateAccountAvatarModal />
          <UpdateAccountBannerModel />
          <UpdateAccountDisplayNameModal />
          <UpdateAccountDescriptionModal />
          <h2 className='mt-2 scroll-m-20 text-2xl font-semibold tracking-tight'>Data</h2>
          <DeleteAccountModal />
        </div>
      </main>
    </div>
  )
}
