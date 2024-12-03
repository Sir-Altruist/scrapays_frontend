import { UPLOAD_BOOK } from "@/api/book";
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
import { Field } from "@/components/ui/field";
import { useMutation } from "@apollo/client";
import {
    Button,
    Spinner,
    Input,
    Stack,
    Textarea
  } from '@chakra-ui/react';
  import { Alert } from '@/components/ui/alert';
import { useState } from "react";
import { useNavigate } from "react-router";



export interface CreateInput {
    name: string;
    description: string;
  }

  export interface UploadResponse {
    createBook:  {
      book:  {
        id: number,
        name: string,
        description: string
      },
      message: string;
      status: string;
      code: number;
    }
  }

  export interface UploadMutationVariables {
    createInput: CreateInput;
  }

export const Modal = ({ open, handleModal }: any) => {
    const [loading, setLoading] = useState(false)
    const [bookData, setBookData] = useState({
        name: '',
        description: ''
    })
    const [display, setDisplay] = useState(false)
    const { name, description } = bookData
    const navigate = useNavigate()
    // const { open, setOpen } = useDialog()
    const [createBook, { data, error }] = useMutation<UploadResponse, UploadMutationVariables>(UPLOAD_BOOK)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBookData({
            ...bookData,
            [e.target.name]: e.target.value
        })
    }

    const handleUpload = async () => {
        try {
            setLoading(true)
            const result = await createBook({
                variables: {
                  createInput: { name, description }
                }
            })
            if(result?.errors?.['code'] === 403){
              localStorage.removeItem('access_token')
              navigate('/login')
            }
            if(result?.data) {
                setDisplay(true)
                setTimeout(() => setDisplay(false), 4000)
                setTimeout(() => navigate(0), 5000)
            }
        } catch (error) {
            setDisplay(true)
            setTimeout(() => setDisplay(false), 3000)
        } finally {
            setLoading(false)
        }
    }
  return (
          <DialogRoot size={"sm"} open={open}>
            {/* <DialogTrigger asChild> */}
            {/* <Button 
            variant="outline" 
            size="sm"
            position="absolute"
            top="10px"
            left="10px"
            >
              Upload Book
            </Button> */}
            {/* </DialogTrigger> */}
            <DialogBackdrop />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Book</DialogTitle>
              </DialogHeader>
              {error && display && <Alert margin={'10px 0'} status={"error"}>{error?.message}</Alert>}
              {data && display && <Alert margin={'10px 0'} status={"success"}>{data?.createBook.message}</Alert>}
              <DialogBody>
              <form>
            <Stack spaceY={2}>
                <Field>
                    <Input 
                        type="text" 
                        name="name" 
                        placeholder="Enter name of the book" 
                        size={"xl"}
                        onChange={e => handleChange(e)}
                        value={name}
                        color={'black'}
                     />
                </Field>
                <Field>
                    <Textarea 
                    placeholder="Enter short description for the book"
                    name="description"
                    onChange={e => handleChange(e)}
                    value={description}
                    />
                </Field>
                {
                    loading ? 
                    <Button backgroundColor={'#0842A6'} width="full" size={'xl'}><Spinner color={'white'} /></Button> : 
                    <Button 
                    type={"button"} 
                    backgroundColor={'#0842A6'} 
                    width="full" 
                    size={'xl'}
                    onClick={handleUpload}
                    >
                      Upload
                    </Button>
                }
            </Stack>
            </form>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button backgroundColor={'red.500'} color={'white'} variant="outline" onClick={() => handleModal("close")}>Close</Button>
                </DialogActionTrigger>
              </DialogFooter>
              <DialogCloseTrigger />
            </DialogContent>
          </DialogRoot>
  )

}

export default Modal;