import { Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="bg-white flex items-center justify-between">
      <div>
        <Heading level="h2" className="txt-xlarge">
          Already have an account?
        </Heading>
        <Text className="txt-medium text-ui-fg-subtle mt-2">
          Sign in for a better experience.
        </Text>
      </div>
      <LocalizedClientLink
        href="/account"
        className="focus-ring text-button inline-flex items-center justify-center min-h-11 px-4 rounded-md bg-page text-ink border border-border hover:bg-surface"
        data-testid="sign-in-button"
      >
        Sign in
      </LocalizedClientLink>
    </div>
  )
}

export default SignInPrompt
