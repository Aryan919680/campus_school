import { Button } from "@/components/ui/button"
import Message from "../home/Message"

const CallBlock = ({name, dest}) => {
  return (
    <div className="p-4 bg-primary rounded-2xl">
      <Message name={name} msg={dest} />
        <Button className="w-full bg-primary-foreground text-white hover:text-primary-foreground hover:bg-white my-2">Schedule a call</Button>
        <Button variant="outline" className="w-full text-primary-foreground hover:text-white">message your doubt</Button>
    </div>
  )
}

export default CallBlock
