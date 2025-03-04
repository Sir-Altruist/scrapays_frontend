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
import { SEND_OTP, SIGN_IN } from '@/api/auth';
import { Alert } from '@/components/ui/alert';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import Logo from "../assets/icon.png"
import { 
  OtpMutationVariables, 
  OtpResponse, 
  SignInMutationVariables, 
  SignInResponse 
} from '@/interfaces';



const Signup: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [userData, setUserData] = useState({
      email: '',
      code: ''
    })
    const navigate = useNavigate()
    const [otpSent, setOtpSent] = useState(false)
    const [display, setDisplay] = useState(false)
    const { email, code } = userData
    const [sendOtp, {  error: otpError }] = useMutation<OtpResponse, OtpMutationVariables>(SEND_OTP)
    const [signIn, { data, error }] = useMutation<SignInResponse, SignInMutationVariables>(SIGN_IN)
    const handleSubmit = async () => {
        try {
            setLoading(true)
            const result = await signIn({
                variables: {
                  signInDto: { email, code }
                }
            });

            if(result?.data?.signIn?.status === "success") {
              localStorage.setItem('access_token', result?.data?.signIn?.token)
              setDisplay(true)
              setTimeout(() => setDisplay(false), 2000)
              setTimeout(() => navigate('/dashboard'), 3000)
            } 

        } catch (error) {
            setDisplay(true)
            setTimeout(() => setDisplay(false), 3000)
        } finally {
            setLoading(false)
        }
    }

    const handleOtp = async () => {
      try {
        setLoading(true)
            const result = await sendOtp({
                variables: {
                  otpDto: { email }
                }
            });

            result?.data?.sendOtp ? setOtpSent(true) : setOtpSent(false)
      
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
        <Image src={Logo} alt='logo' width={'70px'} height={'70px'} margin={'10px auto 20px'} shadow={"rgba(149, 157, 165, 0.2) 0px 8px 24px"} />
        {(error || otpError) && display && <Alert width={'400px'} margin={'0 auto 20px'} status={data ? "success" : "error"}>{otpSent ? error?.message : otpError?.message}</Alert>}
        {data && display &&  <Alert width={'400px'} margin={'0 auto 20px'} status={"success"}>{data?.signIn?.message}</Alert>}
        <Box 
            background={'white'} 
            width={"400px"} 
            // height={'400px'} 
            paddingTop={'100px'}
            color="white" 
            p={8} 
            borderWidth={1} 
            borderRadius={8} 
            borderColor={'#e3e3e3'}
            margin={'0 auto'}
            boxShadow="xl"
        >
        <Heading mb={1} as={'h1'} fontSize={'19px'} textAlign={'center'} color={'#0842A6'}>Welcome Back</Heading>
        <Text mb={2} as={'p'} fontSize={'14px'} textAlign={'center'} color={'#989da6'}>Enter your credentials to access your account</Text>
        <form style={{ margin: '30px 0 10px'}}>
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
                        fontSize={'14px'}
                     />
                </Field>
                {
                  otpSent && (
                    <Field>
                        <Input 
                        type="text" 
                        name="code" 
                        placeholder="Enter otp" 
                        size={"xl"}
                        onChange={e => handleChange(e)}
                        value={code}
                        color={'black'}
                        fontSize={'14px'}
                        />
                    </Field>
                  )
                }
                {
                    loading ? 
                    <Button backgroundColor={'#0842A6'} width="full" size={'xl'}><Spinner color={'white'} /></Button> : 
                    <Button 
                    type={"button"} 
                    backgroundColor={'#0842A6'} 
                    width="full" 
                    size={"md"}
                    onClick={otpSent ? handleSubmit : handleOtp}
                    >
                      {otpSent ? "Login" : "Send Otp"}
                    </Button>
                }
            </Stack>
          </form>
          <Text as={'p'} textAlign={'center'} fontSize={'14px'} color={'#989da6'}>Do not have an account yet? <Link to={'/'} style={{ color: "#0842A6", textDecoration: "underline"}}>Register here</Link></Text>
        </Box>
    </Box>
  );
};

export default Signup;