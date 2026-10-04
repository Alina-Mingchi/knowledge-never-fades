<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Persist user-created tutor profiles through the shared tutor utility so Map and Teach use one browser-storage contract.
- Keep the invoice approval threshold in the shared tutorial rules module so Teach behavior and tests cannot drift.
- Keep browser speech and progressive caption timing in the shared spoken-caption hook so agent surfaces can reuse one playback lifecycle.
- ElevenLabs agent IDs live only in src/lib/elevenlabs.ts (Capture+Map share one, Teach has its own) and all live sessions go through LiveAgentPanel — keeps agent wiring in one place.
