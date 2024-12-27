
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Formlogin from "./login-form"

export function LoginformDialg({open, setOpen}) {

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>เข้าสู่ระบบ</DialogTitle>
          <DialogDescription>
            เข้าสู่ระบบเพื่อใช้งาน
          </DialogDescription>
        </DialogHeader>
        <Formlogin />
      </DialogContent>
    </Dialog>
  )
}
