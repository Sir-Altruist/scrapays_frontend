import React, { useState } from 'react';
import {
  Box,
  Button,
  Spinner,
  Input,
  Heading,
  Stack,
  Text,
  Image
} from '@chakra-ui/react';
import { Field } from "@/components/ui/field"
import { useMutation } from '@apollo/client';
import { SIGN_UP } from '@/api/auth';
import { Alert } from '@/components/ui/alert';
import { Link, useNavigate } from 'react-router-dom';
import Logo from "../assets/icon.png"


// Signup DTO Interface
export interface SignUpDto {
    email: string;
    name: string;
  }
  
  // Signup Response Interface
  export interface SignUpResponse {
    signUp: {
        user: {
          id: string;
          email: string;
          username: string;
        };
        message: string;
        code: number;
        status: string;
    }
  }
  
  // Mutation Hook Type
  export interface SignUpMutationVariables {
    signUpDto: SignUpDto;
  }

const Signup: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [userData, setUserData] = useState({
        email: '',
        name: ''
    })
    const [display, setDisplay] = useState(false)
    const { email, name } = userData;
    const navigate = useNavigate()
    const [signup, { error }] = useMutation<SignUpResponse, SignUpMutationVariables>(SIGN_UP)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setLoading(true)
            const result = await signup({
                variables: {
                  signUpDto: { email, name }
                }
            });

            if(result?.data?.signUp?.status === "success"){
                setDisplay(true)
                setTimeout(() => setDisplay(false), 4000)
                setTimeout(() => navigate('/login'), 4500)
                setUserData(prev => ({
                    ...prev,
                    email: '',
                    name: ''
                }))
            }
        } catch (error) {
            setDisplay(true)
            setTimeout(() => setDisplay(false), 3000)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        })
    }
    
  return (
    <Box width={'100%'} height={'100%'} paddingTop={'150px'}>
        {display && <Alert width={'400px'} margin={'0 auto 20px'} status={error ? "error" : "success"}>{error ? error?.message : "Registration Successful! Kindly verify your email to continue"}</Alert>}
        <Box 
            background={'white'} 
            width={"400px"} 
            paddingTop={'100px'}
            color="white" 
            p={8} 
            borderWidth={1} 
            borderRadius={8} 
            margin={'0 auto'}
            boxShadow="lg"
        >
        <Heading mb={2}  textAlign={'center'} color={'black'}>Welcome to Scrapays Bookstore</Heading>
        <Image src={Logo} alt='logo' width={'60px'} height={'60px'} margin={'10px auto'} />
        <form onSubmit={handleSubmit} style={{ margin: '30px 0 10px'}}>
            <Stack spaceY={2}>
                <Field>
                    <Input 
                        type="email" 
                        name="email" 
                        placeholder="Enter your email" 
                        size={"xl"}
                        onChange={e => handleChange(e)}
                        value={email}
                        color={'black'}
                     />
                </Field>
                <Field>
                    <Input 
                    type="text" 
                    name="name" 
                    placeholder="Enter your username" 
                    size={"xl"}
                    onChange={e => handleChange(e)}
                    value={name}
                    color={'black'}
                     />
                </Field>
                {
                    loading ? 
                    <Button backgroundColor={'#0842A6'} width="full" size={'xl'}><Spinner color={'white'} /></Button> : 
                    <Button type="submit" backgroundColor={'#0842A6'} width="full" size={'xl'}>Register</Button>
                }
            </Stack>
        </form>
        <Text as={'p'} color={'black'} textAlign={'center'}>Already have an account? <Link style={{ color: "#0842A6", textDecoration: "underline"}} to={'/login'}>Login here</Link></Text>
        </Box>
    </Box>
  );
};

export default Signup;