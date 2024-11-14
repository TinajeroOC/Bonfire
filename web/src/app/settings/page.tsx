import { DeleteAccountModal } from "@/components/modals/DeleteAccountModal"
import { UpdateAvatarModal } from "@/components/modals/UpdateAvatarModal"
import { UpdateBannerModel } from "@/components/modals/UpdateBannerModal"
import { UpdateDescriptionModal } from "@/components/modals/UpdateDescriptionModal"
import { UpdateDisplayNameModal } from "@/components/modals/UpdateDisplayNameModal"
import { UpdateEmailModal } from "@/components/modals/UpdateEmailModal"
import { UpdatePasswordModal } from "@/components/modals/UpdatePasswordModal"

export default function SettingsPage() {
  return (
    <div className="flex items-start flex-col gap-4">
      <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">Account</h2>
      <UpdateEmailModal />
      <UpdatePasswordModal />
      <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">Profile</h2>
      <UpdateDisplayNameModal />
      <UpdateDescriptionModal />
      <UpdateAvatarModal />
      <UpdateBannerModel />
      <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">Data</h2>
      <DeleteAccountModal />
    </div>
  )
}
