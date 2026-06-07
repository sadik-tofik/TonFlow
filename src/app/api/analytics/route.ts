/**
 * Analytics sink — swallows TonConnect SDK telemetry so it doesn't
 * error when analytics.ton.org is unreachable / blocked by an adblocker.
 */
export async function POST() {
  return new Response(null, { status: 200 })
}
