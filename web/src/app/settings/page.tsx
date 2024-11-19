import { DeleteAccountModal } from '@/components/modals/DeleteAccountModal'
import { UpdateAvatarModal } from '@/components/modals/UpdateAvatarModal'
import { UpdateBannerModel } from '@/components/modals/UpdateBannerModal'
import { UpdateDescriptionModal } from '@/components/modals/UpdateDescriptionModal'
import { UpdateDisplayNameModal } from '@/components/modals/UpdateDisplayNameModal'
import { UpdateEmailModal } from '@/components/modals/UpdateEmailModal'
import { UpdatePasswordModal } from '@/components/modals/UpdatePasswordModal'

export default function SettingsPage() {
  return (
    <main className='flex flex-shrink flex-grow basis-0 flex-col items-center overflow-auto'>
      <div className='my-4 w-full max-w-5xl px-6'>
        <h1 className='mb-8 mt-4 scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl'>
          Settings
        </h1>
        <div className='flex flex-col items-start gap-4'>
          <h2 className='scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0'>
            Account
          </h2>
          <UpdateEmailModal />
          <UpdatePasswordModal />
          <h2 className='scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0'>
            Profile
          </h2>
          <UpdateDisplayNameModal />
          <UpdateDescriptionModal />
          <UpdateAvatarModal />
          <UpdateBannerModel />
          <h2 className='scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0'>
            Data
          </h2>
          <DeleteAccountModal />
        </div>
      </div>
    </main>
  )
}
