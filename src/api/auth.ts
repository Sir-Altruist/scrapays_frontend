import { gql } from "@apollo/client"


/** Define GraphQL Query */
export const SIGN_UP = gql`
    mutation SignUp($signUpDto: SignUpDto!) {
        signUp(signUpDto: $signUpDto) {
        user {
            id
            email
            username
        }
        message
        code
        status
        }
    }
`;

export const SIGN_IN = gql`
    mutation SignIn($signInDto: SignInDto!) {
        signIn(signInDto: $signInDto) {
            token
            message
            status
            code
        }
    }
`;

export const SEND_OTP = gql`
    mutation SendOtp($otpDto: OtpDto!) {
        sendOtp(otpDto: $otpDto) {
            message
            status
            code
        }
    }
`;