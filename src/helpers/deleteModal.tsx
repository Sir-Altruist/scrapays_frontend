import { DELETE_BOOK } from "@/api/book";
import { Button } from "@/components/ui/button"
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogBackdrop
} from "@/components/ui/dialog"
import { useMutation } from "@apollo/client";
import { Alert } from "@/components/ui/alert";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Spinner } from "@chakra-ui/react";


export interface DeleteResponse {
    deleteBook:  {
      message: string;
      status: string;
      code: number;
    }
}

export interface DeleteMutationVariables {
    id: number
}
const Modal = ({ handleModal, open, existingData }) => {
    const [loading, setLoading] = useState(false)
    const [display, setDisplay] = useState(false)
    const [deleteBook, { data, error }] = useMutation<DeleteResponse, DeleteMutationVariables>(DELETE_BOOK)
    const navigate = useNavigate()

    const handleDelete = async () => {
        try {
            setLoading(true)
            const result = await deleteBook({
                variables: {
                  id: existingData?.id
                },
            })
            if(result?.errors?.['code'] === 403){
              localStorage.removeItem('access_token')
              navigate('/login')
            }
            if(result?.data) {
                setDisplay(true)
                setTimeout(() => setDisplay(false), 3000)
                setTimeout(() => navigate(0), 4000)
            }
        } catch (error) {
            setDisplay(true)
            setTimeout(() => setDisplay(false), 3000)
        } finally {
            setLoading(false)
        }
    }
  return (
    <DialogRoot open={open}>
        <DialogBackdrop />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Book</DialogTitle>
        </DialogHeader>
            {error && display && <Alert margin={'10px 0'} status={"error"}>{error?.message}</Alert>}
            {data && display && <Alert margin={'10px 0'} status={"success"}>{data?.deleteBook.message}</Alert>}
        <DialogBody>
          <p>
            Are you sure you want to delete this book?
          </p>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button color={'white'} onClick={() => handleModal("close")}>No, Cancel</Button>
          </DialogActionTrigger>
          {
            loading ? <Button><Spinner /></Button> : <Button backgroundColor={'red.500'} onClick={() => handleDelete()}>Yes, Proceed</Button>
          }
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}

export default Modal;