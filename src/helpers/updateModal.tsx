import { UPDATE_BOOK } from "@/api/book";
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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";



export interface UpdateInput {
    name?: string;
    description?: string;
  }

  export interface UpdateResponse {
    updateBook:  {
      message: string;
      status: string;
      code: number;
    }
  }

  export interface UpdateMutationVariables {
    id: number,
    updateInput: UpdateInput;
  }

export const Modal = ({ open, handleModal, existingData }: any) => {
    const [loading, setLoading] = useState(false)
    const [bookData, setBookData] = useState({
        name: '',
        description: ''
    })
    const [display, setDisplay] = useState(false)
    const { name, description } = bookData
    const navigate = useNavigate()
    const [updateBook, { data, error }] = useMutation<UpdateResponse, UpdateMutationVariables>(UPDATE_BOOK)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBookData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    
    useEffect(() => {
      if (existingData) {
        setBookData(prev => ({
          ...prev,
          name: existingData?.name || '',
          description: existingData?.description || ''
        }));
      } else {
        // Reset form if no data
        setBookData({
          name: '',
          description: ''
        });
      }
    }, [existingData]);

    const handleUpdate = async () => {
      const token = localStorage.getItem('access_token')
        if(!token){
          navigate('/login')
          return;
        }
        try {
            setLoading(true)
            const result = await updateBook({
                variables: {
                  id: existingData?.id,
                  updateInput: { name, description }
                },
                context: {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                }
            })
            if(result?.errors?.['code'] === 403){
              localStorage.removeItem('access_token')
              navigate('/login')
            }
            if(result?.data) {
                setDisplay(true)
                setTimeout(() => setDisplay(false), 3000)
                setTimeout(() => navigate(0), 3500)
            }
        } catch (error) {
            setDisplay(true)
            setTimeout(() => setDisplay(false), 3000)
        } finally {
            setLoading(false)
        }
    }
  return (
          <DialogRoot size={"sm"} open={open} onOpenChange={() => handleModal("close")}>
            <DialogBackdrop />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Book</DialogTitle>
              </DialogHeader>
              {error && display && <Alert margin={'10px 0'} status={"error"}>{error?.message}</Alert>}
              {data && display && <Alert margin={'10px 0'} status={"success"}>{data?.updateBook.message}</Alert>}
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
                    onClick={handleUpdate}
                    >
                      Update
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