import React from "react";

const LoginGPT1 = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-96 p-8 bg-white shadow-md rounded-lg">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-semibold text-gray-900 ">Welcome Back 👋</h1>
          <p className="text-xl text-slate-700 mt-2">
            Today is a new day. It's your day. You shape it. Sign in to start managing your projects.
          </p>
        </div>

        <form className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-gray-900 text-base mb-1">Email</label>
            <input
              type="email"
              placeholder="Example@email.com"
              className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-900 text-base mb-1">Password</label>
            <input
              type="password"
              placeholder="At least 8 characters"
              className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <a href="#" className="text-blue-700 text-base hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Sign In Button */}
          <button className="w-full py-4 bg-slate-800 text-white text-xl rounded-xl hover:bg-slate-900">
            Sign in
          </button>
        </form>

        {/* OR Separator */}
        <div className="flex items-center my-6">
          <div className="flex-grow border border-slate-300"></div>
          <span className="mx-4 text-slate-700 text-base">Or</span>
          <div className="flex-grow border border-slate-300"></div>
        </div>

        {/* Social Sign-In */}
        <div className="space-y-4">
          <button className="w-full flex items-center justify-center gap-3 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200">
            <span>🔵</span> Sign in with Google
          </button>
          <button className="w-full flex items-center justify-center gap-3 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200">
            <span>🔵</span> Sign in with Facebook
          </button>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-slate-700 text-lg mt-6">
          Don't have an account? <a href="#" className="text-blue-700 hover:underline">Sign up</a>
        </p>

        {/* Footer */}
        <p className="text-center text-slate-400 text-base mt-4">© 2023 ALL RIGHTS RESERVED</p>
      </div>
    </div>
  );
};

const LoginFigma = () =>{
    return (
        <div data-layer="Main Container" className="MainContainer w-[1728px] h-[1140px] p-8 justify-center items-center gap-8 inline-flex">
            <div data-layer="Left side 8 Column" className="LeftSide8Column grow shrink basis-0 self-stretch justify-center items-center flex">
                <div data-layer="Login Form" className="LoginForm w-[388px] flex-col justify-start items-start gap-12 inline-flex">
                <div data-layer="Intro" className="Intro flex-col justify-start items-start gap-7 flex">
                    <div data-layer="Welcome Back 👋" className="WelcomeBack text-center"><span class="text-[#0b1420] text-4xl font-semibold font-['SF Pro Rounded'] leading-9 tracking-tight">Welcome Back </span><span class="text-[#0b1420] text-4xl font-normal font-['SF Pro Rounded'] leading-9 tracking-tight"> 👋</span></div>
                    <div data-layer="Today is a new day. It's your day. You shape it. Sign in to start managing your projects." className="TodayIsANewDayItSYourDayYouShapeItSignInToStartManagingYourProjects text-[#313957] text-xl font-normal font-['SF Pro Display'] leading-loose tracking-tight">Today is a new day. It's your day. You shape it. <br/>Sign in to start managing your projects.</div>
                </div>
                <div data-layer="Form" className="Form self-stretch h-[284px] flex-col justify-center items-end gap-6 flex">
                    <div data-layer="Input" className="Input self-stretch h-[72px] flex-col justify-start items-start gap-2 flex">
                    <div data-layer="Label" className="Label text-[#0b1420] text-base font-normal font-['Roboto'] leading-none tracking-tight">Email</div>
                    <div data-layer="Input" className="Input self-stretch h-12 relative">
                        <div data-layer="Input" className="Input w-[388px] h-12 left-0 top-0 absolute bg-[#f6faff] rounded-xl border border-[#d3d7e3]" />
                        <div data-layer="Placeholder" className="Placeholder left-[16px] top-[16px] absolute text-[#8796ad] text-base font-normal font-['Roboto'] leading-none tracking-tight">Example@email.com</div>
                    </div>
                    </div>
                    <div data-layer="Input" className="Input self-stretch h-[72px] flex-col justify-start items-start gap-2 flex">
                    <div data-layer="Label" className="Label text-[#0b1420] text-base font-normal font-['Roboto'] leading-none tracking-tight">Password</div>
                    <div data-layer="Input" className="Input self-stretch h-12 relative">
                        <div data-layer="Input" className="Input w-[388px] h-12 left-0 top-0 absolute bg-[#f6faff] rounded-xl border border-[#d3d7e3]" />
                        <div data-layer="Placeholder" className="Placeholder left-[16px] top-[16px] absolute text-[#8796ad] text-base font-normal font-['Roboto'] leading-none tracking-tight">At least 8 characters</div>
                    </div>
                    </div>
                    <div data-layer="Forgot Password?" className="ForgotPassword text-center text-[#1d4ae8] text-base font-normal font-['Roboto'] leading-none tracking-tight">Forgot Password?</div>
                    <div data-layer="Main Button" className="MainButton self-stretch py-4 bg-[#162d3a] rounded-xl justify-between items-center inline-flex">
                    <div data-layer="Sign in" className="SignIn text-center text-white text-xl font-normal font-['Roboto'] leading-tight tracking-tight">Sign in</div>
                    </div>
                </div>
                <div data-layer="Social Sign in " className="SocialSignIn flex-col justify-start items-start gap-6 flex">
                    <div data-layer="Or" className="Or w-[388px] py-2.5 justify-center items-center gap-4 inline-flex">
                    <div data-layer="Line 2" className="Line2 grow shrink basis-0 h-[0px] border border-[#cedfe2]"></div>
                    <div data-layer="Or" className="Or text-center text-[#294956] text-base font-normal font-['Roboto'] leading-none tracking-tight">Or</div>
                    <div data-layer="Line 1" className="Line1 grow shrink basis-0 h-[0px] border border-[#cedfe2]"></div>
                    </div>
                    <div data-layer="Social buttons columns" className="SocialButtonsColumns h-[120px] flex-col justify-start items-start gap-4 flex">
                    <div data-layer="Social button" className="SocialButton self-stretch px-[9px] py-3 bg-[#f3f9fa] rounded-xl justify-center items-center gap-4 inline-flex">
                        <div data-svg-wrapper data-layer="Google " className="Google relative">
                        <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_229_6)">
                        <path d="M28.227 14.8225C28.227 13.8709 28.1499 12.914 27.9853 11.9778H14.78V17.3689H22.342C22.0283 19.1077 21.02 20.6458 19.5436 21.6232V25.1213H24.0551C26.7044 22.6829 28.227 19.082 28.227 14.8225Z" fill="#4285F4"/>
                        <path d="M14.78 28.501C18.5559 28.501 21.7402 27.2612 24.0602 25.1213L19.5487 21.6232C18.2935 22.4771 16.6731 22.9607 14.7852 22.9607C11.1328 22.9607 8.03596 20.4966 6.92481 17.1837H2.26929V20.7898C4.64592 25.5174 9.48663 28.501 14.78 28.501Z" fill="#34A853"/>
                        <path d="M6.91966 17.1837C6.33322 15.4449 6.33322 13.5621 6.91966 11.8234V8.21729H2.26928C0.283612 12.1732 0.283612 16.8339 2.26928 20.7898L6.91966 17.1837Z" fill="#FBBC04"/>
                        <path d="M14.78 6.04127C16.776 6.01041 18.7051 6.76146 20.1506 8.14012L24.1477 4.14305C21.6167 1.76642 18.2575 0.45979 14.78 0.500943C9.48663 0.500943 4.64592 3.48459 2.26929 8.21728L6.91966 11.8234C8.02567 8.50536 11.1276 6.04127 14.78 6.04127Z" fill="#EA4335"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_229_6">
                        <rect width="28" height="28" fill="white" transform="translate(0.5 0.5)"/>
                        </clipPath>
                        </defs>
                        </svg>
                        </div>
                        <div data-layer="Sign in with Facebook" className="SignInWithFacebook w-[159px] text-[#313957] text-base font-normal font-['Roboto'] leading-none tracking-tight">Sign in with Google</div>
                    </div>
                    <div data-layer="Social button" className="SocialButton self-stretch px-[9px] py-3 bg-[#f3f9fa] rounded-xl justify-center items-center gap-4 inline-flex">
                        <div data-svg-wrapper data-layer="Facebook " className="Facebook relative">
                        <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_229_19)">
                        <path d="M28.5 14.5C28.5 6.76801 22.232 0.5 14.5 0.5C6.76801 0.5 0.5 6.76801 0.5 14.5C0.5 21.4877 5.61957 27.2796 12.3125 28.3299V18.5469H8.75781V14.5H12.3125V11.4156C12.3125 7.90687 14.4027 5.96875 17.6005 5.96875C19.1318 5.96875 20.7344 6.24219 20.7344 6.24219V9.6875H18.9691C17.23 9.6875 16.6875 10.7668 16.6875 11.875V14.5H20.5703L19.9496 18.5469H16.6875V28.3299C23.3804 27.2796 28.5 21.4877 28.5 14.5Z" fill="#1877F2"/>
                        <path d="M19.9496 18.5469L20.5703 14.5H16.6875V11.875C16.6875 10.7679 17.23 9.6875 18.9691 9.6875H20.7344V6.24219C20.7344 6.24219 19.1323 5.96875 17.6005 5.96875C14.4027 5.96875 12.3125 7.90688 12.3125 11.4156V14.5H8.75781V18.5469H12.3125V28.3299C13.762 28.5567 15.238 28.5567 16.6875 28.3299V18.5469H19.9496Z" fill="white"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_229_19">
                        <rect width="28" height="28" fill="white" transform="translate(0.5 0.5)"/>
                        </clipPath>
                        </defs>
                        </svg>
                        </div>
                        <div data-layer="Sign in with Facebook" className="SignInWithFacebook w-[159px] text-[#313957] text-base font-normal font-['Roboto'] leading-none tracking-tight">Sign in with Facebook</div>
                    </div>
                    </div>
                </div>
                <div data-layer="Don't you have an account? Sign up" className="DonTYouHaveAnAccountSignUp w-[382px] text-center"><span class="text-[#313957] text-lg font-normal font-['Roboto'] leading-[28.80px] tracking-tight">Don't you have an account? </span><span class="text-[#1d4ae8] text-lg font-normal font-['Roboto'] leading-[28.80px] tracking-tight">Sign up</span></div>
                <div data-layer="© 2023 ALL RIGHTS RESERVED" className="2023AllRightsReserved w-[382px] text-center text-[#959cb5] text-base font-normal font-['Roboto'] leading-none tracking-tight">© 2023 ALL RIGHTS RESERVED</div>
                </div>
            </div>
            <div data-layer="Art" className="Art grow shrink basis-0 self-stretch justify-start items-start flex">
                <img data-layer="Login Art " className="LoginArt grow shrink basis-0 self-stretch rounded-3xl" src="https://placehold.co/816x1076" />
            </div>
        </div>
      );
}

const LoginGPT2 = () => {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-8">
        <div className="w-[1728px] flex gap-8">
          {/* Left Side - Login Form */}
          <div className="flex-1 flex justify-center items-center">
            <div className="w-[388px] flex flex-col gap-12">
              {/* Welcome Message */}
              <div className="flex flex-col gap-7">
                <h1 className="text-[#0b1420] text-4xl font-semibold">Welcome Back 👋</h1>
                <p className="text-[#313957] text-xl leading-loose">
                  Today is a new day. It's your day. You shape it. <br /> Sign in to start managing your projects.
                </p>
              </div>
  
              {/* Login Form */}
              <form className="flex flex-col gap-6">
                {/* Email Input */}
                <div>
                  <label className="text-[#0b1420] text-base">Email</label>
                  <input
                    type="email"
                    placeholder="Example@email.com"
                    className="w-full h-12 p-3 bg-[#f6faff] border border-[#d3d7e3] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {/* Password Input */}
                <div>
                  <label className="text-[#0b1420] text-base">Password</label>
                  <input
                    type="password"
                    placeholder="At least 8 characters"
                    className="w-full h-12 p-3 bg-[#f6faff] border border-[#d3d7e3] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {/* Forgot Password */}
                <div className="text-right">
                  <a href="#" className="text-[#1d4ae8] text-base hover:underline">
                    Forgot Password?
                  </a>
                </div>
                {/* Sign In Button */}
                <button className="w-full py-4 bg-[#162d3a] text-white text-xl rounded-xl hover:bg-[#1a374b]">
                  Sign in
                </button>
              </form>
  
              {/* OR Separator */}
              <div className="flex items-center my-6">
                <div className="flex-grow border border-[#cedfe2]"></div>
                <span className="mx-4 text-[#294956] text-base">Or</span>
                <div className="flex-grow border border-[#cedfe2]"></div>
              </div>
  
              {/* Social Sign-In */}
              <div className="space-y-4">
                <button className="w-full flex items-center justify-center gap-3 py-3 bg-[#f3f9fa] text-[#313957] rounded-xl hover:bg-[#e3f1f5]">
                  <img src="/icons/google.svg" alt="Google" className="w-6 h-6" /> Sign in with Google
                </button>
                <button className="w-full flex items-center justify-center gap-3 py-3 bg-[#f3f9fa] text-[#313957] rounded-xl hover:bg-[#e3f1f5]">
                  <img src="/icons/facebook.svg" alt="Facebook" className="w-6 h-6" /> Sign in with Facebook
                </button>
              </div>
  
              {/* Sign Up Link */}
              <p className="text-center text-[#313957] text-lg mt-6">
                Don't have an account? <a href="#" className="text-[#1d4ae8] hover:underline">Sign up</a>
              </p>
  
              {/* Footer */}
              <p className="text-center text-[#959cb5] text-base mt-4">© 2023 ALL RIGHTS RESERVED</p>
            </div>
          </div>
  
          {/* Right Side - Image */}
          <div className="flex-1 flex justify-center items-center">
            <img src="https://placehold.co/816x1076" alt="Login Art" className="rounded-3xl w-full h-auto" />
          </div>
        </div>
      </div>
    );
  };

const LoginGPT3 = () => {
return (
    <div id="MainContainer" className="flex items-center justify-center min-h-screen bg-gray-100 px-8">
    <div className="w-[1728px] flex gap-8">
        {/* Left Side - Login Form */}
        <div id="LeftSide8Column" className="flex-1 flex justify-center items-center">
        <div id="LoginForm" className="w-[388px] flex flex-col gap-12">
            {/* Welcome Message */}
            <div id="Intro" className="flex flex-col gap-7">
            <h1 id="WelcomeBack" className="text-[#0b1420] text-4xl font-semibold font-[\'SF Pro Rounded\']">Welcome Back 👋</h1>
            <p id="TodayIsANewDayItSYourDayYouShapeItSignInToStartManagingYourProjects" className="text-[#313957] text-xl font-[\'SF Pro Display\'] leading-loose">
                Today is a new day. It's your day. You shape it. <br /> Sign in to start managing your projects.
            </p>
            </div>

            {/* Login Form */}
            <form id="Form" className="flex flex-col gap-6">
            {/* Email Input */}
            <div id="InputEmail">
                <label id="LabelEmail" className="text-[#0b1420] text-base font-[\'Roboto\']">Email</label>
                <input
                id="InputEmailField"
                type="email"
                placeholder="Example@email.com"
                className="w-full h-12 p-3 bg-[#f6faff] border border-[#d3d7e3] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            {/* Password Input */}
            <div id="InputPassword">
                <label id="LabelPassword" className="text-[#0b1420] text-base font-[\'Roboto\']">Password</label>
                <input
                id="InputPasswordField"
                type="password"
                placeholder="At least 8 characters"
                className="w-full h-12 p-3 bg-[#f6faff] border border-[#d3d7e3] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            {/* Forgot Password */}
            <div id="ForgotPassword" className="text-right">
                <a id="ForgotPasswordLink" href="#" className="text-[#1d4ae8] text-base font-[\'Roboto\'] hover:underline">
                Forgot Password?
                </a>
            </div>
            {/* Sign In Button */}
            <button id="SignInButton" className="w-full py-4 bg-[#162d3a] text-white text-xl font-[\'Roboto\'] rounded-xl hover:bg-[#1a374b]">
                Sign in
            </button>
            </form>

            {/* OR Separator */}
            <div id="OrSeparator" className="flex items-center my-6">
            <div id="Line2" className="flex-grow border border-[#cedfe2]"></div>
            <span id="OrText" className="mx-4 text-[#294956] text-base font-[\'Roboto\']">Or</span>
            <div id="Line1" className="flex-grow border border-[#cedfe2]"></div>
            </div>

            {/* Social Sign-In */}
            <div id="SocialSignIn" className="space-y-4">
            <button id="GoogleSignIn" className="w-full h-[52px] flex items-center justify-center gap-4 px-[9px] py-3 bg-[#f3f9fa] text-[#313957] rounded-xl hover:bg-[#e3f1f5]">
                <img id="GoogleIcon" src="/images/Google.png" alt="Google" className="w-[29px] h-[29px]" />
                <span id="GoogleSignInText" className="w-[159px] text-[#313957] text-base font-[\'Roboto\'] leading-none tracking-tight">
                Sign in with Google
                </span>
            </button>
            <button id="FacebookSignIn" className="w-full h-[52px] flex items-center justify-center gap-4 px-[9px] py-3 bg-[#f3f9fa] text-[#313957] rounded-xl hover:bg-[#e3f1f5]">
                <img id="FacebookIcon" src="/images/Facebook.png" alt="Facebook" className="w-[29px] h-[29px]" />
                <span id="FacebookSignInText" className="w-[159px] text-[#313957] text-base font-[\'Roboto\'] leading-none tracking-tight">
                Sign in with Facebook
                </span>
            </button>
            </div>

            {/* Sign Up Link */}
            <p id="SignUpPrompt" className="text-center text-[#313957] text-lg font-[\'Roboto\'] mt-6">
            Don't have an account? <a id="SignUpLink" href="#" className="text-[#1d4ae8] hover:underline">Sign up</a>
            </p>

            {/* Footer */}
            <p id="FooterText" className="text-center text-[#959cb5] text-base font-[\'Roboto\'] mt-4">© 2023 ALL RIGHTS RESERVED</p>
        </div>
        </div>

        {/* Right Side - Image */}
        <div id="Art" className="flex-1 flex justify-center items-center">
        <img id="LoginArt" src="/images/LoginArt.png" alt="Login Art" className="rounded-3xl w-full h-auto" />
        </div>
    </div>
    </div>
);
};

const LoginGPT4 = () => {
  return (
    <div id="MainContainer" className="flex items-center justify-center min-h-screen bg-[#ffffff] px-8">
      <div className="w-[1728px] flex justify-center items-center gap-8">
        {/* Left Side - Login Form */}
        <div id="LeftSide8Column" className="grow shrink basis-0 self-stretch justify-center items-center flex">
          <div id="LoginForm" className="w-[388px] flex flex-col justify-start items-start gap-12">
            {/* Welcome Message */}
            <div id="Intro" className="flex flex-col justify-start items-start gap-7">
              <h1 id="WelcomeBack" className="text-[#0b1420] text-4xl font-semibold font-[\'SF Pro Rounded\']">Welcome Back 👋</h1>
              <p id="TodayIsANewDayItSYourDayYouShapeItSignInToStartManagingYourProjects" className="text-[#313957] text-xl font-[\'SF Pro Display\'] leading-loose">
                Today is a new day. It's your day. You shape it. <br /> Sign in to start managing your projects.
              </p>
            </div>

            {/* Login Form */}
            <form id="Form" className="self-stretch h-[284px] flex flex-col justify-center items-end gap-6">
              {/* Email Input */}
              <div id="InputEmail" className="self-stretch h-[72px] flex flex-col justify-start items-start gap-2">
                <label id="LabelEmail" className="text-[#0b1420] text-base font-[\'Roboto\']">Email</label>
                <input
                  id="InputEmailField"
                  type="email"
                  placeholder="Example@email.com"
                  className="w-[388px] h-12 bg-[#f6faff] border border-[#d3d7e3] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Password Input */}
              <div id="InputPassword" className="self-stretch h-[72px] flex flex-col justify-start items-start gap-2">
                <label id="LabelPassword" className="text-[#0b1420] text-base font-[\'Roboto\']">Password</label>
                <input
                  id="InputPasswordField"
                  type="password"
                  placeholder="At least 8 characters"
                  className="w-[388px] h-12 bg-[#f6faff] border border-[#d3d7e3] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Forgot Password */}
              <div id="ForgotPassword" className="text-right">
                <a id="ForgotPasswordLink" href="#" className="text-[#1d4ae8] text-base font-[\'Roboto\'] hover:underline">
                  Forgot Password?
                </a>
              </div>
              {/* Sign In Button */}
              <button id="SignInButton" className="self-stretch py-4 bg-[#162d3a] text-white text-xl font-[\'Roboto\'] rounded-xl hover:bg-[#1a374b]">
                Sign in
              </button>
            </form>

            {/* OR Separator */}
            <div id="OrSeparator" className="w-[388px] py-2.5 flex justify-center items-center gap-4">
              <div id="Line2" className="flex-grow h-[0px] border border-[#cedfe2]"></div>
              <span id="OrText" className="text-[#294956] text-base font-[\'Roboto\']">Or</span>
              <div id="Line1" className="flex-grow h-[0px] border border-[#cedfe2]"></div>
            </div>

            {/* Social Sign-In */}
            <div id="SocialSignIn" className="flex flex-col justify-start items-start gap-6">
              <button id="GoogleSignIn" className="w-full h-[52px] flex justify-center items-center gap-4 px-[9px] py-3 bg-[#f3f9fa] text-[#313957] rounded-xl hover:bg-[#e3f1f5]">
                <img id="GoogleIcon" src="/images/Google.png" alt="Google" className="w-[29px] h-[29px]" />
                <span id="GoogleSignInText" className="w-[159px] text-[#313957] text-base font-[\'Roboto\']">Sign in with Google</span>
              </button>
              <button id="FacebookSignIn" className="w-full h-[52px] flex justify-center items-center gap-4 px-[9px] py-3 bg-[#f3f9fa] text-[#313957] rounded-xl hover:bg-[#e3f1f5]">
                <img id="FacebookIcon" src="/images/Facebook.png" alt="Facebook" className="w-[29px] h-[29px]" />
                <span id="FacebookSignInText" className="w-[159px] text-[#313957] text-base font-[\'Roboto\']">Sign in with Facebook</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <p id="SignUpPrompt" className="w-[382px] text-center text-[#313957] text-lg font-[\'Roboto\'] mt-6">
              Don't have an account? <a id="SignUpLink" href="#" className="text-[#1d4ae8] hover:underline">Sign up</a>
            </p>

            {/* Footer */}
            <p id="FooterText" className="w-[382px] text-center text-[#959cb5] text-base font-[\'Roboto\'] mt-4">© 2023 ALL RIGHTS RESERVED</p>
          </div>
        </div>

        {/* Right Side - Image */}
        <div id="Art" className="grow shrink basis-0 self-stretch justify-start items-start flex">
          <img id="LoginArt" src="/images/LoginArt.png" alt="Login Art" className="w-full h-auto rounded-3xl" />
        </div>
      </div>
    </div>
  );
};

const LoginGPT5 = () => {
  return (
    <div id="MainContainer" className="flex items-center justify-center min-h-screen bg-[#ffffff] px-8">
      <div className="w-[1728px] flex flex-col md:flex-row gap-16 md:gap-32">
        {/* Left Side - Login Form */}
        <div id="LeftSide8Column" className="flex-1 flex justify-center items-center">
          <div id="LoginForm" className="w-[350px] md:w-[388px] flex flex-col gap-10 md:gap-12">
            {/* Welcome Message */}
            <div id="Intro" className="flex flex-col gap-5 md:gap-7">
              <h1 id="WelcomeBack" className="text-[#0b1420] text-3xl md:text-4xl font-semibold font-[\'SF Pro Rounded\']">Welcome Back 👋</h1>
              <p id="TodayIsANewDayItSYourDayYouShapeItSignInToStartManagingYourProjects" className="text-[#313957] text-lg md:text-xl font-[\'SF Pro Display\'] leading-loose">
                Today is a new day. It's your day. You shape it. <br /> Sign in to start managing your projects.
              </p>
            </div>

            {/* Login Form */}
            <form id="Form" className="flex flex-col gap-5 md:gap-6">
              {/* Email Input */}
              <div id="InputEmail">
                <label id="LabelEmail" className="text-[#0b1420] text-base font-[\'Roboto\']">Email</label>
                <input
                  id="InputEmailField"
                  type="email"
                  placeholder="Example@email.com"
                  className="w-full h-12 p-3 bg-[#f6faff] border border-[#d3d7e3] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Password Input */}
              <div id="InputPassword">
                <label id="LabelPassword" className="text-[#0b1420] text-base font-[\'Roboto\']">Password</label>
                <input
                  id="InputPasswordField"
                  type="password"
                  placeholder="At least 8 characters"
                  className="w-full h-12 p-3 bg-[#f6faff] border border-[#d3d7e3] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Forgot Password */}
              <div id="ForgotPassword" className="text-right">
                <a id="ForgotPasswordLink" href="#" className="text-[#1d4ae8] text-base font-[\'Roboto\'] hover:underline">
                  Forgot Password?
                </a>
              </div>
              {/* Sign In Button */}
              <button id="SignInButton" className="w-full py-4 bg-[#162d3a] text-white text-xl font-[\'Roboto\'] rounded-xl hover:bg-[#1a374b]">
                Sign in
              </button>
            </form>

            {/* OR Separator */}
            <div id="OrSeparator" className="flex items-center my-4 md:my-6">
              <div id="Line2" className="flex-grow border border-[#cedfe2]"></div>
              <span id="OrText" className="mx-4 text-[#294956] text-base font-[\'Roboto\']">Or</span>
              <div id="Line1" className="flex-grow border border-[#cedfe2]"></div>
            </div>

            {/* Social Sign-In */}
            <div id="SocialSignIn" className="space-y-3 md:space-y-4">
              <button id="GoogleSignIn" className="w-full h-[52px] flex items-center justify-center gap-4 px-[9px] py-3 bg-[#f3f9fa] text-[#313957] rounded-xl hover:bg-[#e3f1f5]">
                <img id="GoogleIcon" src="/images/Google.png" alt="Google" className="w-[29px] h-[29px]" />
                <span id="GoogleSignInText" className="w-[159px] text-[#313957] text-base font-[\'Roboto\']">Sign in with Google</span>
              </button>
              <button id="FacebookSignIn" className="w-full h-[52px] flex items-center justify-center gap-4 px-[9px] py-3 bg-[#f3f9fa] text-[#313957] rounded-xl hover:bg-[#e3f1f5]">
                <img id="FacebookIcon" src="/images/Facebook.png" alt="Facebook" className="w-[29px] h-[29px]" />
                <span id="FacebookSignInText" className="w-[159px] text-[#313957] text-base font-[\'Roboto\']">Sign in with Facebook</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <p id="SignUpPrompt" className="text-center text-[#313957] text-lg font-[\'Roboto\'] mt-4 md:mt-6">
              Don't have an account? <a id="SignUpLink" href="#" className="text-[#1d4ae8] hover:underline">Sign up</a>
            </p>

            {/* Footer */}
            <p id="FooterText" className="text-center text-[#959cb5] text-base font-[\'Roboto\'] mt-4">© 2023 ALL RIGHTS RESERVED</p>
          </div>
        </div>

        {/* Right Side - Image */}
        <div id="Art" className="flex-1 flex justify-center items-center">
          <img id="LoginArt" src="/images/LoginArt.png" alt="Login Art" className="rounded-3xl w-full h-auto max-w-md md:max-w-full" />
        </div>
      </div>
    </div>
  );
};

const LoginGPT6 = () => {
  return (
    <div id="MainContainer" className="flex items-center justify-center min-h-screen bg-[#ffffff] px-8">
      <div className="w-[1728px] flex gap-16 md:gap-32">
        {/* Left Side - Login Form */}
        <div id="LeftSide8ColumnContainer" className="flex-1 flex justify-center items-center">
          <div id="LeftSide8Column" className="w-full md:w-auto px-4 md:px-0">
            <div id="LoginForm" className="w-[320px] md:w-[350px] flex flex-col gap-8 md:gap-10 mt-12 md:mt-20 mb-12 md:mb-20">
              {/* Welcome Message */}
              <div id="Intro" className="flex flex-col gap-5 md:gap-7">
                <h1 id="WelcomeBack" className="text-[#0b1420] text-3xl md:text-4xl font-semibold font-[\'SF Pro Rounded\']">Welcome Back 👋</h1>
                <p id="TodayIsANewDayItSYourDayYouShapeItSignInToStartManagingYourProjects" className="text-[#313957] text-lg font-[\'SF Pro Display\'] leading-loose">
                  Today is a new day. It's your day. You shape it. <br /> Sign in to start managing your projects.
                </p>
              </div>

              {/* Login Form */}
              <form id="Form" className="flex flex-col gap-5 md:gap-6">
                {/* Email Input */}
                <div id="InputEmail">
                  <label id="LabelEmail" className="text-[#0b1420] text-base font-[\'Roboto\']">Email</label>
                  <input
                    id="InputEmailField"
                    type="email"
                    placeholder="Example@email.com"
                    className="w-full h-12 p-3 bg-[#f6faff] border border-[#d3d7e3] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {/* Password Input */}
                <div id="InputPassword">
                  <label id="LabelPassword" className="text-[#0b1420] text-base font-[\'Roboto\']">Password</label>
                  <input
                    id="InputPasswordField"
                    type="password"
                    placeholder="At least 8 characters"
                    className="w-full h-12 p-3 bg-[#f6faff] border border-[#d3d7e3] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {/* Forgot Password */}
                <div id="ForgotPassword" className="text-right">
                  <a id="ForgotPasswordLink" href="#" className="text-[#1d4ae8] text-base font-[\'Roboto\'] hover:underline">
                    Forgot Password?
                  </a>
                </div>
                {/* Sign In Button */}
                <button id="SignInButton" className="w-full py-4 bg-[#162d3a] text-white text-xl font-[\'Roboto\'] rounded-xl hover:bg-[#1a374b]">
                  Sign in
                </button>
              </form>

              {/* OR Separator */}
              <div id="OrSeparator" className="flex items-center my-4 md:my-6">
                <div id="Line2" className="flex-grow border border-[#cedfe2]"></div>
                <span id="OrText" className="mx-4 text-[#294956] text-base font-[\'Roboto\']">Or</span>
                <div id="Line1" className="flex-grow border border-[#cedfe2]"></div>
              </div>

              {/* Social Sign-In */}
              <div id="SocialSignIn" className="space-y-3 md:space-y-4">
                <button id="GoogleSignIn" className="w-full h-[52px] flex items-center justify-center gap-4 px-[9px] py-3 bg-[#f3f9fa] text-[#313957] rounded-xl hover:bg-[#e3f1f5]">
                  <img id="GoogleIcon" src="/images/Google.png" alt="Google" className="w-[29px] h-[29px]" />
                  <span id="GoogleSignInText" className="w-[159px] text-[#313957] text-base font-[\'Roboto\']">Sign in with Google</span>
                </button>
                <button id="FacebookSignIn" className="w-full h-[52px] flex items-center justify-center gap-4 px-[9px] py-3 bg-[#f3f9fa] text-[#313957] rounded-xl hover:bg-[#e3f1f5]">
                  <img id="FacebookIcon" src="/images/Facebook.png" alt="Facebook" className="w-[29px] h-[29px]" />
                  <span id="FacebookSignInText" className="w-[159px] text-[#313957] text-base font-[\'Roboto\']">Sign in with Facebook</span>
                </button>
              </div>

              {/* Sign Up Link */}
              <p id="SignUpPrompt" className="text-center text-[#313957] text-lg font-[\'Roboto\'] mt-4 md:mt-6">
                Don't have an account? <a id="SignUpLink" href="#" className="text-[#1d4ae8] hover:underline">Sign up</a>
              </p>

              {/* Footer */}
              <p id="FooterText" className="text-center text-[#959cb5] text-base font-[\'Roboto\'] mt-4">© 2023 ALL RIGHTS RESERVED</p>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div id="ArtContainer" className="flex-1 flex justify-center items-center md:w-auto">
          <div id="Art" className="w-full flex justify-center items-center">
            <img id="LoginArt" src="/images/LoginArt.png" alt="Login Art" className="rounded-3xl w-full h-auto max-w-xs md:max-w-md lg:max-w-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginFigma;
