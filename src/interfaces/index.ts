/** Signup Dto */
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


// Signup DTO Interface
export interface SignInDto {
    email: string;
    code: string;
  }
  
  export interface OtpDto {
    email: string;
  }
  
    
    // Signup Response Interface
  export interface SignInResponse {
      signIn: {
        token: string;
        message: string;
        code: number;
        status: string;
      }
    }
  export interface OtpResponse {
      sendOtp: {
        message: string;
        code: number;
        status: string;
      }
    }
    
    // Mutation Hook Type
  export interface SignInMutationVariables {
      signInDto: SignInDto;
    }
  
  export interface OtpMutationVariables {
      otpDto: OtpDto;
    }